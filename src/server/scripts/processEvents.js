let wsdcConfig = require ('../handlers/wsdc');
let fDB = require('../handlers/fireDB');

let wsdc = wsdcConfig();
let fireDB = fDB();
let finish = () => {
    process.exit("Finished!");
};
wsdc.GetEvents()
    .then((results) => {
        return fireDB.WriteEventsToFirebase(results);
    })
    .then(() => {
        fireDB.GetEvents()
            .then(() => finish());
    })
    .catch((error) => {
        console.log("Error: ", error);
        finish();
    });
