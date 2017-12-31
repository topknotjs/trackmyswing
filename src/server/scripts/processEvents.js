let wsdcConfig = require ('../handlers/wsdc');
let fDB = require('../handlers/fireDB');

let wsdc = wsdcConfig();
let fireDB = fDB();
let finish = () => {
    process.exit("Finished!");
};
wsdc.GetEvents()
    .then((results) => {
        //results = results.slice(0, 3).reverse();
        //fireDB.WriteEventsToFirebase(results);
        results.forEach((event, index) => {
            fireDB.WriteEventToFirebase(event.GetKey(), event);
        });
       finish();
    })
    .catch((error) => {
        console.log("Error: ", error);
        finish();
    });
