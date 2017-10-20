let wsdcConfig = require ('../handlers/wsdc');
let fDB = require('../handlers/fireDB');
let dancerDef = require('../definitions/Dancer');

let wsdc = wsdcConfig();
let fireDB = fDB();
let processDancerValues = (results) => {
    let fetchDancers = (dancerSet) => {
        let nextPromise = new Promise((resolve, reject) => {
            let i = 0, promises = [];        
            while(i < dancerSet.length){
                let ci = dancerSet[i++];
                while(!ci.hasOwnProperty('value')){
                    ci = dancerSet[i++];                    
                }
                promises.push(wsdc.GetDancer(ci.value));
            }
    
            Promise.all(promises)
                .then(results => {
                    results.forEach((result) => {
                        if(!result.hasOwnProperty('dancer') || !result.dancer.hasOwnProperty('wscid')) return;
                        let dancer = new dancerDef(result);
                        console.log("Dancer: ", dancer);
                        fireDB.WriteDancerToFirebase(dancer.WSCID, dancer);
                    });
                    resolve("done");
                })
                .catch((error) => {
                    reject("Problem with promise set: ", error);
                });
        });        
        return nextPromise;
    };

    let run = (i, step) => {
        if(i >= results.length){
            console.log("Exit 1");
            return;
        }else if((i + step) >= results.length){
            console.log("Exit 2");
            run(i, results.length - 1);
            return;
        }
        console.log(`Fetching: ${i} - ${i + step}`);
        fetchDancers(results.slice(i, i + step))
            .then(() => {
                setTimeout(() => {
                    run(i + step, step);
                }, 2000);                
            });
        
    };
    run(0, 10);
};

wsdc.GetDancers()
    .then((results) => {
       processDancerValues(results);
    });;

