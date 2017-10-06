let dbConfig = require('./dbConfig');
let mysql = require('mysql');
const DB = function(){
    this.con = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.dbname
    });
    
    this.executeQuery = function(sql){
        this.con.connect(function(err){
            if(err) throw err;
        });
        let promise = new Promise((resolve, reject) => { 
            this.con.query(sql, (err, result) => {
                if(err) reject(err);
                resolve(result);
                this.con.end();
            });
            
        });
        return promise;        
    };
};

module.exports = DB;
