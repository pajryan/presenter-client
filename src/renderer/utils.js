const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const Stream = require('stream').Transform;
const archiver = require('archiver');

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
          if(o.status && o.status === 200){
            callback(o);
          }else{
            console.error('error in getPresentations', data)
            callback(null, {error: o.error})
          }
        });
    });

    request.on('error', error => {
      console.error('error making getPresentations call', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  },


  getImagesList: function(dataUrl, apiKey, callback){
    let postData = {data:{apiKey: apiKey}};
    let opts = { host: dataUrl, port:80, path: '/getImagesList', method: 'POST', headers: {'Content-Type': 'application/json'}};
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
      console.log('error making getImagesList call', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  },



  publishDataArchive: function(dataUrl, apiKey, archivePath, fileName, callback){
    let postData = {data:{apiKey:apiKey}};
    let opts = { host: dataUrl, port:80, path: '/saveDataArchive', method: 'POST', headers: {'Content-Type': 'image/png'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};

    let fullURL = dataUrl + 'saveDataArchive';
    let fullArchivePath = path.join(archivePath, fileName)
    console.log('posting (data archive) to (url) ', fullArchivePath, fullURL)

    var req = request.post(fullURL, function (err, resp, body) {
      if (err) {
        console.error('Error publishing data archive', err);
        callback({status:400, error: err})
      } else {
        callback({status:200})
      }
    });

    var form = req.form();
    form.append('file', fs.createReadStream(fullArchivePath));
    
  },
  


  getDataArchiveList: function(dataUrl, apiKey, localDataArchiveNames, callback){
    let postData = {data:{archives: localDataArchiveNames, apiKey: apiKey}};
    let opts = { host: dataUrl, port:80, path: '/getDataArchiveList', method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};
    let request = http.request(opts, res => {
        res.setEncoding('utf8');
        res.on('data', data => {
          console.log('got respons', data)
          let o=JSON.parse(data);
          if(o.status && o.status === 200){
            callback(o);
          }else{
            console.error('error in getDataArchiveList', data)
            callback(null, {error: o.error})
          }
        });
    });

    request.on('error', error => {
      console.error('error making getDataArchiveList call', error);
      callback(null, {error: error});
    });
    request.write(JSON.stringify(postData));
    request.end();
  },


  extractKeyValueFromObject: function(itm, key, returnedValues = []){
    if(typeof itm === 'object'){
      for( let k in itm){
        if(k === key){
          returnedValues.push(itm[k]);
        }
        this.extractKeyValueFromObject(itm[k], key, returnedValues)
      }
    }else if(typeof itm === 'array'){
      itm.forEach(i => {
        this.extractKeyValueFromObject(i, key, returnedValues)
      })
    }
    return returnedValues
  },


  publishImage: function(dataUrl, apiKey, imgPath, fileName, callback){
    let postData = {data:{apiKey:apiKey}};
    let opts = { host: dataUrl, port:80, path: '/saveImage', method: 'POST', headers: {'Content-Type': 'image/png'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};

    let fullURL = dataUrl + 'saveImage';
    // console.log('posting (image) to (url) ', imgPath, fullURL)

    var req = request.post(fullURL, function (err, resp, body) {
      if (err) {
        console.error('Error publishing image', err);
        callback({status:400, error: err})
      } else {
        callback({status:200})
      }
    });

    var form = req.form();
    form.append('file', fs.createReadStream(imgPath));
    
  },

  




  downloadImage: function(dataUrl, apiKey, fileName, downloadToPath, callback){
    let postData = {data:{apiKey: apiKey, fileName: fileName}};
    let opts = { host: dataUrl, port:80, path: '/downloadImage', method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};

    let fullURL = dataUrl + 'downloadImage';
    try{
      request.post({ url: fullURL, json: postData}).pipe(fs.createWriteStream(downloadToPath));
      callback({status:200})
    }catch(err){
      callback({status:400, error: err})
    }
  },

  listImagesInLocalStore: function(imageDirectory){
    let images = [];
    fs.readdirSync(imageDirectory).forEach(file => {
      if(file.indexOf('.DS') == -1){
        images.push(file);
      }
    });
    return images;
  },



  zipDirectory: function(dirToZip, zipPath, zipFileName, callback){

    var output = fs.createWriteStream(path.join(zipPath, zipFileName));
    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    
    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
      console.log('zip file has been created ('+archive.pointer()+' total bytes)', zipPath, zipFileName);
      callback(null)
    });
    
    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.error('error creating archive', err)
        callback(err)
      } else {
        callback(err)
      }
    });
    
    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      callback(err)
    });
    
    // pipe archive data to the file
    archive.pipe(output);
    archive.directory(dirToZip, false);
    archive.finalize();
  },




  getDataArchive: function(dataUrl, apiKey, archiveFile, downloadToPath, callback){
    let postData = {data:{apiKey: apiKey, fileName: archiveFile}};
    let opts = { host: dataUrl, port:80, path: '/downloadDataArchive', method: 'POST', headers: {'Content-Type': 'application/json'}};
    if(dataUrl.indexOf('localhost') != -1){opts.port = 3000; opts.host="localhost"};

    let fullURL = dataUrl + 'downloadDataArchive';
    try{
      request.post({ url: fullURL, json: postData}).pipe(fs.createWriteStream(path.join(downloadToPath, archiveFile)));
      callback({status:200})
    }catch(err){
      callback({status:400, error: err})
    }
  },








  
}
