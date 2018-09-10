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
    console.log('running qury: ', this.dataSource.sqlString)



    sql.connect(config, err => {
      // ... error checks
   
      const request = new sql.Request()
      request.stream = true // You can set streaming differently for each request
      request.query(this.dataSource.sqlString) // or request.execute(procedure)
   
      request.on('recordset', columns => {  // Emitted once for each recordset in a query
        // this contains a bunch of useful info about the columns
        console.log('recordset', columns)
      })
   
      request.on('row', row => {  // Emitted for each row in a recordset
        // console.log('row', row)
        this.results.push(row)
      })
   
      request.on('error', err => {  // May be emitted multiple times
        console.error('error', err)
      })
   
      request.on('done', result => {  // Always emitted as the last one
        sql.close();
        // contains # of records
        console.log('done', result)
        this.callback(
          {
            success: true,
            results: this.results
          },
          this.dataSource
        )

      })
    })
    
    sql.on('error', err => {
      sql.close();
      console.log('Top error', err)
      this.callback(
        {
          success: false,
          error: err
        },
        this.dataSource
      )
    })




  }


  
 
  




}