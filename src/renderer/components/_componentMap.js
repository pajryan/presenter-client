// this exists because you can't dynamically include/require a library.
//  e.g. you can't do the following:
//    `require('../component/' + myObj.componentName)
//  the string in a require must be static
//
// but, when I'm loading a 'chapter', I don't know what components i'll need.
// the general suggestion to solve this is to load all possible components, then get what you need in a giant switch statment.
// that's gross.
// but it's the only option. So that's what this file does.


module.exports = function getComponent(componentName){
  let components = {
    // any new components need to be registered here.  the passed name needs to match one of these keys.
    HistoryOfIdeas: require('./HistoryOfIdeas.vue').default,
    TestDataComponent: require('./TestDataComponent.vue').default
  }

  // import AdminUI from './adminUI/AdminUI.vue'

  let chosenComponent = components[componentName]

  if(!chosenComponent){
    console.error('you tried to fetch component "' + componentName + '" but it does not exist. Check _componentMap.js!  Available components are:', components)
    return null;
  }

  return chosenComponent

}
