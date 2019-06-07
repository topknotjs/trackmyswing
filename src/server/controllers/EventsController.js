const express = require('express');
// const path = require('path');
// const dancers = require('./handlers/dancers');
const dancerDef = require('../definitions/Event');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');
const wsdc = require('../handlers/wsdc');

let wsdcAPI = wsdc();
let fireDB = fDB();
let logger = new LoggerService();

const router = express.Router();
router.get('/', function(req, res) {
	fireDB
		.GetEvents()
		.then(results => {
			logger.info(`Found events ${Object.keys(results).length}`);
			//Need to construct actual event object list
			res.send(results);
		})
		.catch(error => {
			logger.error(`Get dancer ${req.params.wsdcid} error: ${error}`);
			res.send({ error });
		});
});
router.get('/:id', function(req, res) {
	fireDB
		.GetEvent(req.params.id)
		.then(results => {
			logger.info(`Found events ${Object.keys(results).length}`);
			//Need to construct actual event object list
			res.send(results);
		})
		.catch(error => {
			logger.error(`Get dancer ${req.params.wsdcid} error: ${error}`);
			res.send({ error });
		});
});

module.exports = router;
