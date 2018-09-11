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
    this.recordCount = -1;

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
      
      let onRecordset = (columns) => {  // Emitted once for each recordset in a query
        this.recordCount++;
        this.results[this.recordCount] = [];  // initialize an array for this record set
        console.log('recordset', columns) // this contains a bunch of useful info about the columns
      }
      request.on('recordset', onRecordset)

   
      let onRow = (row) => {  // Emitted for each row in a recordset
        this.results[this.recordCount].push(row)
      }
      request.on('row', onRow)
   
      let onError = (err) => {  // May be emitted multiple times
        console.error('error', err)
        this.callback(
          {success: false, error: err},
          this.dataSource
        )
      }
      request.on('error', onError)
   

      let onDone = (result) => {  // ALWAYS emitted as the last one. result contains # of records etc.
        request.removeListener('recordset', onRecordset);
        request.removeListener('row', onRow);
        request.removeListener('error', onError);
        request.removeListener('done', onDone);
        sql.close();
        this.callback(
          {success: true, result: result.rowsAffected},
          this.dataSource
        )
      }
      request.on('done', onDone)


    })
    
    let onSqlError = (err) => {
      sql.close();
      sql.removeListener('error', onSqlError);
      console.log('Top error', err)
      this.callback(
        {success: false,error: err},
        this.dataSource
      )
    }
    sql.on('error', onSqlError)





  }


  
 
  




}