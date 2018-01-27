let fDB = require('../handlers/fireDB');
let fireDB = fDB();
let finish = () => {
    process.exit("Finished!");
};
fireDB.TestCon()
    .then(() => {
        finish();
    });
