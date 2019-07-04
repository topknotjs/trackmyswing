const express = require('express');
const LoggerService = require('../handlers/logger');
const DancerService = require('../services/DancerService');
let logger = new LoggerService();
const dancerService = new DancerService();
const router = express.Router();
router.get('/:wsdcid', async function(req, res) {
	// TODO: Go to firebase first before going here
	try {
		const dancer = await dancerService.getDancer(req.params.wsdcid);
		res.send(dancer.toJSON());
	} catch (error) {
		logger.error(`Get dancer ${req.params.wsdcid} error: ${error}`);
		res.send({ error });
	}
});
router.get('/wsdc/:wsdcid', async function(req, res) {
	// TODO: Go to firebase first before going here
	try {
		const dancer = await dancerService.getWsdcDancer(req.params.wsdcid);
		res.send(dancer.toJSON());
	} catch (error) {
		logger.error(`Get dancer ${req.params.wsdcid} error: ${error}`);
		res.send({ error });
	}
});

router.get('/wsdc/process/:wsdcid', async function(req, res) {
	// TODO: Go to firebase first before going here
	try {
		const dancer = await dancerService.processWsdcDancer(req.params.wsdcid);
		res.send(dancer.toJSON());
	} catch (error) {
		logger.error(`Get dancer ${req.params.wsdcid} error: ${error}`);
		res.send({ error });
	}
});

module.exports = router;
