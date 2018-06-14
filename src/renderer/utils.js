const http = require('http');

module.exports = {

  getUUID: function() {
    //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },


  checkIfOnline: function(callback){
    let dataUrl = 'www.google.com'
    require('dns').resolve(dataUrl, function(err) {
      if (err) {
        console.error('trying to connect to internet resulted in', err)
        callback(false)
      } else {
        callback(true)
      }
    })
  },


  checkIfHaveDataConnection: function(dataUrl, callback){
    // the dns.resolve fails on localhost... making local dev difficult...  So if I find localhost, using http.request.  
    //    But don't want o use http.request generally because it requires me to split out host, port etc.
    if(dataUrl.indexOf('localhost') != -1){
      let opts = { host: 'localhost', port: '3000', path: '/', method: 'GET'}
      let request = http.request(opts, res => {
          res.setEncoding('utf8');
          res.on('data', data => {
            let o, success=true;
            try {
              o = JSON.parse(data);
            } catch (e) {
              success = false;
              console.error('when checking data connection, received JSON parse error when parsing: ', data);
              callback(false);
            }
            if(success && o.status && o.status === 200){ callback(true); }else {callback(false)}
          });
      });

      request.on('error', error => {
        console.log('error connecting to localhost', error);
        callback(false);
      });
      request.end();
    }else{
      require('dns').resolve(dataUrl, function(err) {
        if (err) {
          console.error('trying to connect to data service resulted in', err)
          callback(false)
        } else {
          callback(true)
        }
      })
    }
  },

  checkIfHaveValidApiKey: function(dataUrl, apiKey, callback){
    let postData = {data:{apiKey:apiKey}}
    let opts = { host: dataUrl, port:80, path: '/apiCheck', method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};
    let request = http.request(opts, res => {
        res.setEncoding('utf8');
        res.on('data', data => {
          let o=JSON.parse(data);
          if(o.status && o.status === 200){
            callback(o);
          }else{
            callback(null, {error: o.error})
          }
        });
    });

    request.on('error', error => {
      console.error('error checking if have valid api key', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  
  },


  checkOnlineAndDataConnectionAndApiKey: function(dataUrl, apiKey, callback){
    this.checkIfOnline(online => {
      if(online){
        this.checkIfHaveDataConnection(dataUrl, dataConnected => {
          if(dataConnected){
            this.checkIfHaveValidApiKey(dataUrl, apiKey, apiAccepted => {
              if(apiAccepted){
                callback(true);
              }else{
                callback(false, {error:"Your API key was rejected."});      
              }
            })
          }else{
            callback(false, {error:"It looks like you are online, but the data service provider is not available."});    
          }
        })
      }else{
        callback(false, {error:"It looks like you are not online."});
      }
    })


  },

  // fetch data from data service
  dataServiceCall: function(dataUrl, apiKey, endpoint, callback){
    let postData = {data:{apiKey: apiKey}};
    let opts = { host: dataUrl, port:80, path: endpoint, method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};
    let request = http.request(opts, res => {
        res.setEncoding('utf8');
        res.on('data', data => {
          let o=JSON.parse(data);
          if(o.error){
            callback(null, {error: o.error})
          }else{
            callback(o);
          }
        });
    });

    request.on('error', error => {
      console.log('error making dataService call', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  },



  publishPresentation: function(dataUrl, apiKey, endpoint, presentation, callback){
    let postData = {data:{presentation:presentation, apiKey:apiKey}};
    let opts = { host: dataUrl, port:80, path: endpoint, method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};
    let request = http.request(opts, res => {
        res.setEncoding('utf8');
        res.on('data', data => {
          let o=JSON.parse(data);
          if(o.status && o.status === 400){
            callback(null, {error: o.error})
          }else{
            callback(o);
          }
        });
    });

    request.on('error', error => {
      console.log('error making publishPresentation call', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  },

  getPresentations: function(dataUrl, apiKey, localPresentationIds, callback){
    let postData = {data:{presentations: localPresentationIds, apiKey: apiKey}};
    let opts = { host: dataUrl, port:80, path: '/getPresentations', method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};
    let request = http.request(opts, res => {
        res.setEncoding('utf8');
        res.on('data', data => {
          let o=JSON.parse(data);
          if(o.status && o.status === 400){
            callback(null, {error: o.error})
          }else{
            callback(o);
          }
        });
    });

    request.on('error', error => {
      console.log('error making getPresentations call', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  }



  
}
