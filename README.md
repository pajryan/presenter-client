
 # presenter-client
Goal of this is to have a multi-client presentation layer

# Boilerplate
Starting with electron [electron builder](https://github.com/electron-userland/electron-builder)
it has:
 - bundling cross platform (OSX & Win)
 - autoUpdate added in (with [electron-updater](https://www.electron.build/auto-update))

The project structure & what the boilerplate expects is [here](https://webpack.electron.build/project-structure)

Currently using [Vue.js](https://vuejs.org/v2/guide/index.html) as the MVC framework.

## running
```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```


## in-scope
 - [ ] notify and install app updates
     - app updates will be developed locally in project `presenter-updateServer`
 - [ ] edit presentation
     - [ ] editing by permission only
     - [ ] flow
     - [ ] text
     - [ ] static images
 - [ ] push edits to server
     - [ ] conflict resolution
 - [ ] notify and update clients with presentation edits


## app updates
Following this instructions [here](https://github.com/iffy/electron-updater-example).  Specifically, have a look at `main.js` in that project.
App signing [here](https://help.apple.com/xcode/mac/current/#/dev3a05256b8)


### apple certificates
 - open Xcode
 - Xcode -> Preferences
 - Click `Accounts`
 - Add/Create apple ID if needed
 - Select apple ID
 - Bottom right, click `Manage certificates...`
 - If need to create, click "plus dropdown" at bottom left and choose `Mac Development` (This is where installers, distribution certificates can be created I think)
 - New Certificate shows up in Keychain (under `login`, `My Certificates` should see *Mac Developer: ~appleId~)
 - now Export that certificate by right-clicking in Keychain and choose export. Will be prompted to create a pwd for that (`presenterCert1` for dev)