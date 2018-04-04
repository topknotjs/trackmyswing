/**
 * The intention with this script is to pull a full list of all dancers as quickly as possible.
 * The current problem is that the wsdc service shuts down after too many requests per second.
 * Solutions:
 *  - HTTP2 batch requests?
 *  - Discover better throttle options
 */
let wsdcConfig = require ('../handlers/wsdc');
let fDB = require('../handlers/fireDB');
let dancerDef = require('../definitions/Dancer');

let wsdc = wsdcConfig();
let fireDB = fDB();
let finish = () => {
    process.exit("Finished!");
};
let processDancerValues = (results) => {
    return new Promise((resolve, reject) => {
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
                            let dancer = new dancerDef();
                            dancer.LoadWSDC(result);                   
                            console.log("Loading dancer: ", dancer.WSCID);
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
            if(step == 0){
                console.log("Exit 1");
                resolve();
                return;
            }else if((i + step) >= results.length){
                console.log(`Exit 2 - [i: ${i} step: ${step} length: ${results.length}]`);
                let increment = results.length - i - 1;
                run(i, increment);
                return;
            }
            console.log(`Fetching: ${i} - ${i + step}`);
            fetchDancers(results.slice(i, i + step))
                .then(() => {
                    setTimeout(() => {
                        run(i + step, step);
                    }, 2000);                
                })
                .catch((error) => {
                    reject("Internal error: ", error);
                });
            
        };
        run(0, 10);
    });
};

wsdc.GetDancers()
    .then((results) => {
        processDancerValues(results)
            .then(() => {
                finish();
            })
            .catch((error) => {
                console.log("Error: ", error);
                finish();
            });
    });

