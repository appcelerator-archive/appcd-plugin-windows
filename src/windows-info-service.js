import DetectEngine, { RegistryWatcher } from 'appcd-detect';
import gawk from 'gawk';
import version from './version';

import * as windowslib from 'windowslib';

import { arrayify, debounce, get, mergeDeep } from 'appcd-util';
import { DataServiceDispatcher } from 'appcd-dispatcher';
import { expandPath } from 'appcd-path';

/**
 * The Windows info service.
 */
export default class WindowsInfoService extends DataServiceDispatcher {

	/**
	 * A list of all active Visual Studio registry watchers.
	 * @type {Array.<RegistryWatcher>}
	 */
	vsRegWatchers = [];

	/**
	 * Initializes the timers for polling Windows information.
	 *
	 * @param {Config} cfg - An Appc Daemon config object.
	 * @returns {Promise}
	 * @access public
	 */
	async activate(cfg) {
		this.config = cfg;
		if (cfg.windows) {
			mergeDeep(windowslib.options, cfg.windows);
		}
		gawk.watch(cfg, 'windows', () => mergeDeep(windowslib.options, cfg.windows || {}));

		this.data = gawk({
			sdks: {},
			visualstudio: {},
			vswhere: null
		});

		await Promise.all([
			this.initSDKs(),
			this.initVisualStudios()
		]);
	}

	/**
	 * Shutsdown the Windows info service.
	 *
	 * @returns {Promise}
	 * @access public
	 */
	async deactivate() {
		for (const w of this.vsRegWatchers) {
			w.stop();
		}

		if (this.sdkDetectEngine) {
			await this.sdkDetectEngine.stop();
			this.sdkDetectEngine = null;
		}

		await appcd.fs.unwatch('visualstudio');
	}

	/**
	 * Detect Windows SDKs.
	 *
	 * @returns {Promise}
	 * @access private
	 */
	async initSDKs() {
		const paths = [
			...arrayify(get(this.config, 'windows.sdk.searchPaths'), true),
			windowslib.sdk.defaultPath
		];

		this.sdkDetectEngine = new DetectEngine({
			checkDir(dir) {
				try {
					return windowslib.sdk.detectSDKs(dir);
				} catch (e) {
					// 'dir' is not an SDK
				}
			},
			depth:               1,
			multiple:            true,
			name:                'windows:sdk',
			paths,
			recursive:           true,
			recursiveWatchDepth: 3,
			redetect:            true,
			registryKeys:        windowslib.sdk.registryKeys.map(key => ({ key })),
			watch:               true
		});

		// listen for sdk results
		this.sdkDetectEngine.on('results', results => {
			const sdks = {};
			for (const sdk of results.sort((a, b) => version.compare(a.version, b.version))) {
				sdks[sdk.version] = sdk;
			}
			gawk.set(this.data.sdks, sdks);
		});

		await this.sdkDetectEngine.start();

		gawk.watch(this.config, [ 'windows', 'sdk', 'searchPaths' ], value => {
			this.sdkDetectEngine.paths = [
				...arrayify(value, true),
				windowslib.sdk.defaultPath
			];
		});
	}

	/**
	 * Detect Visual Studio installations.
	 *
	 * @returns {Promise}
	 * @access private
	 */
	async initVisualStudios() {
		const detectVS = debounce(async () => {
			const results = {};
			const vswhere = await windowslib.vswhere.getVSWhere(true);

			gawk.merge(this.data, { vswhere: vswhere && vswhere.exe || null });

			if (vswhere) {
				// detect the Visual Studio installations
				for (const info of await vswhere.query()) {
					try {
						// detect MSBuild
						info.msbuild = (await vswhere.query({
							requires: 'Microsoft.Component.MSBuild',
							find:     'MSBuild\\**\\Bin\\MSBuild.exe',
							version:  info.installationVersion
						}))[0];

						if (info.isComplete) {
							const vs = new windowslib.vs.VisualStudio(info);
							results[vs.version] = vs;
						}
					} catch (e) {
						// squelch
					}
				}

				await appcd.fs.watch({
					type: 'vswhere',
					paths: [
						vswhere.exe,
						expandPath(windowslib.vswhere.defaultPath)
					],
					handler: detectVS
				});
			} else {
				await appcd.fs.unwatch('vswhere');
			}

			gawk.set(this.data.visualstudio, results);
		});

		await detectVS();

		this.vsRegWatchers = Object
			.entries(windowslib.vs.registryKeys)
			.map(([ key, filter ]) => {
				return new RegistryWatcher({ filter, key }).on('change', detectVS).start();
			});

		appcd.fs.watch({
			type: 'visualstudio',
			depth: 2,
			paths: [
				...arrayify(get(this.config, 'windows.visualstudio.searchPaths'), true),
				windowslib.vs.defaultPath
			],
			handler: detectVS
		});

		gawk.watch(this.config, [ 'windows' ], detectVS);
	}
}
