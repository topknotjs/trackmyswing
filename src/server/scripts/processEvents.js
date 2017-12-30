let wsdcConfig = require ('../handlers/wsdc');
let fDB = require('../handlers/fireDB');

let wsdc = wsdcConfig();
let fireDB = fDB();

wsdc.GetEvents()
    .then((results) => {
       //console.log(results);
    })
    .catch((error) => {
        
    });

