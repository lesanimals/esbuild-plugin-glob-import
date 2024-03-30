
# esbuild-plugin-glob-import

ESBuild plugin to use globs to import multiple files.

## Install

```sh
$ npm i github:lesanimals/esbuild-plugin-glob-import
```

## Setup

Add the plugin to your esbuild options.

```js
import esbuild from 'esbuild'
import globImport from 'esbuild-plugin-glob-import'

esbuild.build({
  // ...
  plugins: [
    globImport()
  ]
})
```

## Tested with this code:

```js
import 'folder/*/js/__*.js';
import 'other-folder/*/*/js/*.js';
```

## Prior Art

+ [esbuild-plugin-glob-import from whaaaley](https://github.com/whaaaley/esbuild-plugin-glob-import)
+ [esbuild](https://esbuild.github.io/)
+ [esbuild-plugin-import-glob](https://github.com/thomaschaaf/esbuild-plugin-import-glob)
+ [fast-glob](https://github.com/mrmlnc/fast-glob)
