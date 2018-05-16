
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

# BUILD FOR MAC AND WIN. Push to Github where the app will check for updates automatically.
npm run publish

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

## steps to release new build (and notify / update clients)
 - 1. First be sure to increment the version in package.json
    - **if you don't increment the version, it won't be published to github**
    - if you get an error related to `ELECTRON_HMR_SOCKET_PATH ` try:
        - removing `node_modules` and `yarn.lock` then running `yarn upgrade` (this didn't work for me, but referenced [here](https://github.com/electron-userland/electron-webpack/issues/58))
        - 
 - 2. Run `npm run publish` to create both mac and win versions and post update to github (takes several minutes)
 - 3. go to `https://github.com/pajryan/presenter-client/releases` and locate the new `draft` release
 - 4. Click `edit` to the right of the release. Scroll down and click `publish release`
    - can download the release (e.g. the DMG) from here too.
 - 5. When you next download the app, it will check for an update and automatically download/update.


## in-scope
 - [ ] notify and install app updates
     - app updates will be stored as releases in this gihub project
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
 - now Export that certificate by right-clicking in Keychain and choose export. Will be prompted to create a pwd for it

 ### passwords
 passwords for github, cert signing etc are in `PASSWORDS.md` (not committed to github... duh.)

 ### issues
  - setting the GH_TOKEN environment variable seems to only last for the terminal session (?)
    - `export GH_TOKEN="<GH TOKEN in PASSWORDS.md>`
    - see info on [enironment variables](https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255)