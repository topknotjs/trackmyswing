const express = require('express');
// const path = require('path');
// const dancers = require('./handlers/dancers');
const dancerDef = require('../definitions/Dancer');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');
const wsdc = require('../handlers/wsdc');

let wsdcAPI = wsdc();
let fireDB = fDB();
let logger = new LoggerService();

const router = express.Router();
router.get('/:wsdcid', function(req, res) {
	// TODO: Go to firebase first before going here
	wsdcAPI
		.GetDancer(req.params.wsdcid)
		.then(result => {
			logger.info(`Found dancer ${req.params.wsdcid}`);
			let newDancer = new dancerDef();
			newDancer.LoadWSDC(result);
			res.send({ constructed: newDancer.toJSON() });
		})
		.catch(error => {
			logger.error(`Get dancer ${req.params.wsdcid} error: ${error}`);
			res.send({ error });
		});
});

module.exports = router;
