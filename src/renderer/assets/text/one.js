//these are meant to be mmd files, but webpack doesnt seem to konw what to do with mmd, and it kills the build
//having trouble understanding how to bundle mmd.  might have to do something like:

export function mmd () {
  return `
  ### a title
  
  
  `
}

//alternatively, looks like I can put mmd files in the static/ directory (outside of /src/) which webpack ignores.
//  https://webpack.electron.build/project-structure
//  https://webpack.electron.build/using-static-assets