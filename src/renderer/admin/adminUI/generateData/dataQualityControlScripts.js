let stats = require('stats-analysis')

module.exports = class QueryRunnerFileWriter {

  constructor(data, scriptString){
    this.data = data;
    return eval('this.' + scriptString)
  }


  findOutlier(){
    console.log(' in find outlier', arguments)
    for(var i=0; i<arguments.length; i++){
      let a = arguments[i]
      let extract = this.data.map(d => d[a]); // convert the array of objects to an array of only the value we care about
      let indexOfOutliers = stats.indexOfOutliers(extract)
      console.log('--------: ' + a)
      console.log('  outliers ', indexOfOutliers)
    }
  }

  findMedian(){
    console.log(' in find median', arguments)
    for(var i=0; i<arguments.length; i++){
      let a = arguments[i]
      let extract = this.data.map(d => d[a]); 
      let median = stats.median(extract)
      return{
        label: 'median',
        value: median
      }
    }
  }

}