
 # presenter-client
Goal of this is to have a multi-client presentation layer

# Boilerplate
Starting with electron [electron builder](https://github.com/electron-userland/electron-builder)
it has:
 - bundling cross platform (OSX & Win)
 - autoUpdate bundled in (with [electron-updater](https://www.electron.build/auto-update))

The project structure & what the boilerplate expects is [here](https://webpack.electron.build/project-structure)

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





