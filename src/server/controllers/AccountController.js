const express = require('express');
// const path = require('path');
// const dancers = require('./handlers/dancers');
const dancerDef = require('../definitions/Dancer');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');
const wsdc = require('../handlers/wsdc');
const accountDef = require('../definitions/Account');
let wsdcAPI = wsdc();
let fireDB = fDB();
let logger = new LoggerService();

const router = express.Router();
router.post('/attend/:event_id/:account_id', function(req, res){
    fireDB.WriteAttendanceToEvent(req.params.event_id, req.params.account_id)
        .then((result) => {
            res.send("Success");        
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});

router.put('/', function(req, res){
	let account = new accountDef(req.body);
	console.log("Found account: ", account);
    if(account.HasError()){//Create more full error handling
        res.send("Error");
	}
    fireDB.WriteAccountToFirebase(account)
        .then((result) => {
            res.send(account); 
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});
router.get('/:id', function(req, res){
	// TODO: this belongs in the account getter
    fireDB.GetAccountById(req.params.id)
        .then((result) => {
            res.send(result); 
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});
router.get('/facebook/', async function(req, res){
	console.log("received content from facebook: ", req.body, req.params);
});

module.exports = router;