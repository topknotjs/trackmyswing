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
router.post('/attend/:event_id/:account_id', function(req, res) {
	fireDB
		.WriteAttendanceToEvent(req.params.event_id, req.params.account_id)
		.then(result => {
			res.send('Success');
		})
		.catch(error => {
			res.status(400).send('Error: ' + error);
		});
});
router.post('/logout', function(req, res) {
	res.clearCookie('x-account');
	res.sendStatus(200);
});

router.post('/login', function(req, res) {
	const reqBody = req.body;
	const email = reqBody.email;
	const password = reqBody.password ? reqBody.password : null;
	const facebookId = reqBody.facebookId ? reqBody.facebookId : null;
	if (!email || (!password && !facebookId)) {
		res.status(404).send('Missing email or password or facebookId');
		return;
	}
	// TODO: Put this into constant
	const cookieAddition = 1000 * 60 * 60 * 24;
	// TODO: Create actual cookie handling
	if (!req.cookies['x-account']) {
		res.cookie('x-account', email, { expire: Date.now() + cookieAddition });
	} else {
		if (req.cookies['x-account'] !== email) {
			res.cookie('x-account', email, {
				expire: Date.now() + cookieAddition,
			});
		}
	}
	fireDB
		.Login(email, password, facebookId)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(404).send('Login error: ' + error);
		});
});

router.get('/login', async function(req, res) {
	// TODO: Create actual cookie handling
	if (!req.cookies['x-account']) {
		res.sendStatus(404);
	} else {
		const account = await fireDB.GetAccountByEmail(
			req.cookies['x-account']
		);
		if (account.accountId) {
			res.send(account);
		}
		res.sendStatus(404);
	}
});

router.post('/', async function(req, res) {
	let account = new accountDef(req.body);
	if (account.HasError()) {
		// TODO: Create more full error handling
		res.status(400).send('Error');
		return;
	}
	let dupAccount = await fireDB.GetAccountByEmail(account.Email);
	if (!!dupAccount) {
		res.send('Error: duplicate account');
		return;
	}
	fireDB
		.WriteAccountToFirebase(account)
		.then(accountId => {
			return fireDB.GetAccountById(accountId);
		})
		.then(result => {
			res.send(result.toJSON());
		})
		.catch(error => {
			res.status(400).send('Error: ' + error);
		});
});
router.post('/:id', async function(req, res) {
	if (!req.params.id || !req.body) {
		// TODO: Create more full error handling
		res.status(400).send('Error: Missing parameters');
		return;
	}
	let { id } = req.params;
	let data = req.body;
	fireDB
		.UpdateAccountInFirebase(id, data)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(400).send('Error: ' + error);
		});
});
router.get('/:id', function(req, res) {
	// TODO: this belongs in the account getter
	let { id } = req.params;
	fireDB
		.GetAccountById(id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(404).send('Error: ' + error);
		});
});
router.get('/', function(req, res) {
	// TODO: this belongs in the account getter
	let { email } = req.query;

	fireDB
		.GetAccountByEmail(email)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(404).send('Error: ' + error);
		});
});
router.get('/facebook/', async function(req, res) {
	console.log('received content from facebook: ', req.body, req.params);
});

module.exports = router;
