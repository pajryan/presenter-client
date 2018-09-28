let stats = require('stats-analysis')

module.exports = class QueryRunnerFileWriter {

  constructor(data, dataSource, scriptString){
    this.data = data;
    this.dataSource = dataSource;
    this.resultHandling = this.dataSource.resultHandling; // the string that comes from dataSourceConfig.json qa.scripts
    this.currentIndex = 0;  // keep track of the result set we're evaulating

    console.log('data', this.data)
    console.log('dataSource', this.dataSource)
    console.log('scriptString', this.scripts)


    this.resultHandling.forEach((rh, i) => {  // corresponds to a result set
      this.currentIndex = i
      rh.qa.scripts.forEach(s => {
        eval('this.' + s)
      })
      
    })
    
  }


  findOutlier(){
    console.log(' in find outlier', arguments)
    for(var i=0; i<arguments.length; i++){
      let a = arguments[i]
      // NOTE HARDCODING TO THE FIRST RESULT.
      //  need to think about this.. it can return multiple results..!
      let extract = this.data[this.currentIndex].map(d => d[a]); // convert the array of objects to an array of only the value we care about
      let median = stats.median(extract)
      let indexOfOutliers = stats.indexOfOutliers(extract)
      console.log('--------: ' + a)
      console.log('  median ', median)
      console.log('  outliers ', indexOfOutliers)
    }


  }

}