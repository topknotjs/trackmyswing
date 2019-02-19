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
    .then((result) => {
      res.send('Success');
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
});

router.post('/login', function(req, res) {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Missing email or password');
    return;
  }
  fireDB
    .Login(email, password)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400).send('Login error: ' + error);
    });
});

router.put('/', async function(req, res) {
  let account = new accountDef(req.body);
  if (account.HasError()) {
    //Create more full error handling
    res.status(400).send('Error');
    return;
  }
  let dupAccount = await fireDB.GetAccountByEmail(account.Email);
  if (!!dupAccount) {
    res.send('Error: duplicate account');
    return;
  }
  console.log('Account: ', account);
  fireDB
    .WriteAccountToFirebase(account)
    .then((result) => {
      res.send(account);
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
});
router.post('/:id', async function(req, res) {
  if (!req.params.id || !req.body) {
    //Create more full error handling
    res.status(400).send('Error: Missing parameters');
    return;
  }
  let { id } = req.params;
  let data = req.body;
  fireDB
    .UpdateAccountInFirebase(id, data)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400).send('Error: ' + error);
    });
});
router.get('/:id', function(req, res) {
  // TODO: this belongs in the account getter
  let { id } = req.params;
  if (id.indexOf('@') !== -1) {
    fireDB
      .GetAccountByEmail(id)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send('Error: ' + error);
      });
  } else {
    fireDB
      .GetAccountById(id)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send('Error: ' + error);
      });
  }
});
router.get('/facebook/', async function(req, res) {
  console.log('received content from facebook: ', req.body, req.params);
});

module.exports = router;
