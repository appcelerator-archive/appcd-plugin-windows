# @appcd/plugin-windows

Windows service for the Appc Daemon.

Report issues to [GitHub issues][2]. Official issue tracker in [JIRA][3].

## Info

The `info` service uses [windowslib][4] to detect the installed Windows information and returns
the information.

```js
const { response } = await appcd.call('/windows/latest/info');
console.log(response);
```

## Legal

This project is open source under the [Apache Public License v2][1] and is developed by
[Axway, Inc](http://www.axway.com/) and the community. Please read the [`LICENSE`][1] file included
in this distribution for more information.

[1]: https://github.com/appcelerator/appcd-plugin-windows/blob/master/LICENSE
[2]: https://github.com/appcelerator/appcd-plugin-windows/issues
[3]: https://jira.appcelerator.org/projects/DAEMON/issues
[4]: https://github.com/appcelerator/windowslib
