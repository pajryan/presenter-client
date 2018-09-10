'use strict'

const sql = require('mssql')
const pwd = require('../../../../PASSWORDS.json')


const config = {
  user: pwd.databaseUsername, 
  password: pwd.databasePassword, 
  server: pwd.databaseServer,
  // database: '...',

  options: {
      encrypt: false // Use this if you're on Windows Azure
  }
}


module.exports = class QueryRunner {

  constructor(dataSource, callback){
    console.log('in query runner', dataSource)

    this.dataSource = dataSource;
    this.callback = callback;

    this.results = [];  // this is an ARRAY of ARRAYS to support multiple recordsets

    this.run();
  }


  run(){

    sql.connect(config, err => {
   
      const request = new sql.Request()
      request.stream = true               // You can set streaming differently for each request

      if(this.dataSource.isStoredProcedure){
        request.execute(this.dataSource.sqlString) 
      }else{
        let sqlstring = this.dataSource.sqlString
        // parameters
        this.dataSource.sqlParameters.forEach((p, i) => {
          let paramReplace = "{" + (i+1) + "}";
          sqlstring = sqlstring.replace(paramReplace, p.value)
        })
        request.query(sqlstring)
      }
      
   
      request.on('recordset', columns => {  // Emitted once for each recordset in a query
        console.log('recordset', columns) // this contains a bunch of useful info about the columns
      })
   
      request.on('row', row => {  // Emitted for each row in a recordset
        this.results.push(row)
      })
   
      request.on('error', err => {  // May be emitted multiple times
        console.error('error', err)
        this.callback(
          {success: false, error: err},
          this.dataSource
        )
      })
   
      request.on('done', result => {  // ALWAYS emitted as the last one. result contains # of records etc.
        sql.close();
        this.callback(
          {success: true, results: this.results},
          this.dataSource
        )
      })
    })
    
    sql.on('error', err => {
      sql.close();
      console.log('Top error', err)
      this.callback(
        {success: false,error: err},
        this.dataSource
      )
    })




  }


  
 
  




}