# v2.0.2 (Jun 8, 2020)

 * chore: Added API version 2.x.
 * chore: Transpile for Node 10 instead of Node 8. Not a breaking change as appcd has always
   guaranteed Node 10 or newer.
 * chore: Updated dependencies.

# v2.0.1 (Jan 9, 2020)

 * chore: Switched to new `appcd.apiVersion`.
   [(DAEMON-309)](https://jira.appcelerator.org/browse/DAEMON-309)
 * chore: Updated dependencies.

# v2.0.0 (Nov 9, 2019)

 * BREAKING CHANGE: Removed all Windows Phone related code.
 * BREAKING CHANGE: Renamed `windows` to `sdks` in info results.
 * BREAKING CHANGE: Removed `selectedVisualStudio` from info results.
 * feat: Wired up live configuration changes.
   [(DAEMON-198)](https://jira.appcelerator.org/browse/DAEMON-198)
 * fix: Updated config to remove redundant `windows` namespace.

# v1.5.1 (Nov 8, 2019)

 * chore: Update dependencies.

# v1.5.0 (Aug 15, 2019)

 * chore: Added Appc Daemon v3 to list of compatible appcd versions.
 * chore: Update dependencies.

# v1.4.0 (Jun 6, 2019)

 * fix: Updated config to remove redundant `windows` namespace.
 * chore: Switched `prepare` script to `prepack`.

# v1.3.0 (Mar 29, 2019)

 * chore: Upgraded to Gulp 4.
 * chore: Update dependencies.
 * refactor: Refactored promises to use async/await.

# v1.2.0 (Oct 25, 2018)

 * chore: Moved to `@appcd` scope
 * chore: Update dependencies
 * feat: Add Daemon 2.x support

# v1.1.0 (Apr 9, 2018)

 * fix: Removed `appcd-*` dependencies and locked down the appcd version in the `package.json`.
   [(DAEMON-208)](https://jira.appcelerator.org/browse/DAEMON-208)
 * fix: Fixed URLs in `package.json`.
 * chore: Updated dependencies.

# v1.0.0 (Dec 5, 2017)

 * Initial release.
