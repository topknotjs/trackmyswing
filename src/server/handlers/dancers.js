let DB = require('./db');
let db = new DB();
//TODO: Setup as GraphQL API to a firebase db
class Dancers{
    constructor(){

    }
    GetDBDancers(){
        //Move this into the database class
        let promise = new Promise((resolve, reject) => {
            let sql = `SELECT * FROM dancers where division='${division}' and role='${role}' order by wsdc desc`;
            let sqlPromise = db.executeQuery(sql);
            sqlPromise.then((results) => {
                resolve(results);
            })
            .catch((err) => {
                reject(err);
            });
        });        
        return promise;
    }
}
module.exports = function(){
    return new Dancers();
};