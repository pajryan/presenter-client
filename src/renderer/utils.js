module.exports = {

  checkIfOnline: function(callback){
    require('dns').resolve('www.google.com', function(err) {
      if (err) {
        callback(false)
      } else {
        callback(true)
      }
    })
  }
  
}
