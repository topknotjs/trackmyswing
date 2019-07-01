const express = require('express');
// const path = require('path');
// const dancers = require('./handlers/dancers');
const dancerDef = require('../definitions/Event');
const EventsService = require('../services/EventsService');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');
const HttpResponse = require('../definitions/HttpResponse');
const wsdc = require('../handlers/wsdc');
let logger = new LoggerService();
const eventsService = new EventsService();
const router = express.Router();
router.get('/', async function(req, res) {
	try {
		const events = await eventsService.getAllEvents();
		res.send(
			events.reduce((acc, event) => {
				acc.push(event.toJSON());
				return acc;
			}, [])
		);
	} catch (error) {
		res.send({ error });
	}
});

router.get('/current', async function(req, res) {
	try {
		const events = await eventsService.getCurrentYearEvents();
		res.send(
			events.reduce((acc, event) => {
				acc.push(event.toJSON());
				return acc;
			}, [])
		);
	} catch (error) {
		res.status(HttpResponse.NotFound).send(error);
	}
});
router.get('/:id', async function(req, res) {
	try {
		const event = await eventsService.getEvent(req.params.id);
		res.send(event.toJSON());
	} catch (error) {
		logger.error(`Get dancer ${req.params.id} error: ${error}`);
		res.status(HttpResponse.NotFound).send(error);
	}
});

module.exports = router;
