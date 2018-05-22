module.exports = {

  msg: function(key){
    const messages = {
      "no-internet-connection": {severity: 3, text:'It looks like you are not connected to the internet. Connect to the internet and try again.'},
      "no-data-service-conection": {severity: 3, text:'You appear to be connected to the internet, but the data-update service is not available. Contact Patrick.'},
      "first-time-fetching-data": {severity: 3, text:'This is the first time you have fetched data. The application does not work until you have pulled down the latest, and it may take a little while. Please proceed with the data update, and be patient!'}
    }





    return {
      severity: messages[key].severity,
      text: messages[key].text
    }
  }
}