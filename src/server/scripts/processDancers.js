let wsdcConfig = require ('../handlers/wsdc');
let fDB = require('../handlers/fireDB');
let dancerDef = require('../definitions/Dancer');

let wsdc = wsdcConfig();
let fireDB = fDB();
let processDancerValues = (results) => {
    let fetchDancers = () => {
        let max = 5, i = 0, promises = [];        
        while(i <= max){
            let ci = results[i++];
            while(!ci.hasOwnProperty('value')){
                ci = results[i++];
                max++;
            }
            console.log("KV: ", ci);
            promises.push(wsdc.GetDancer(ci.value));
        }
        return promises;
    };
    let promises = fetchDancers();
    Promise.all(promises)
        .then(results => {
            results.forEach((result) => {
                console.log("Result: ", result);
                if(!result.hasOwnProperty('dancer') || !result.dancer.hasOwnProperty('wscid')) return;
                let dancer = new dancerDef(result);
                console.log("Writing dancer: ", dancer);
                fireDB.WriteDancerToFirebase(dancer.WSCID, dancer);
            });
        });
};

wsdc.GetDancers()
    .then((results) => {
       processDancerValues(results);
    });;

