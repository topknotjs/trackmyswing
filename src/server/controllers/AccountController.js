const express = require('express');
const AccountService = require('../services/AccountService');
const HttpResponse = require('../definitions/HttpResponse');
// const path = require('path');
// const dancers = require('./handlers/dancers');
const dancerDef = require('../definitions/Dancer');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');
const wsdc = require('../handlers/wsdc');
const accountDef = require('../definitions/Account');
const CookiesHandler = require('../middlewares/cookies').CookiesHandler;
let wsdcAPI = wsdc();
let fireDB = fDB();
let logger = new LoggerService();
const accountService = new AccountService();
const router = express.Router();

router.post('/attend/:event_id/:account_id', async function(req, res) {
  try {
    const account = await accountService.writeAttendanceToEvent(
      req.params.event_id,
      req.params.account_id
    );
    res.send(account.toJSON());
  } catch (error) {
    res.status(HttpResponse.Conflict).send(error.toString());
  }
});

router.post('/unattend/:event_id/:account_id', async function(req, res) {
  try {
    const account = await accountService.removeAttendanceFromEvent(
      req.params.event_id,
      req.params.account_id
    );
    res.send(account.toJSON());
  } catch (error) {
    res.status(HttpResponse.Conflict).send(error.toString());
  }
});

router.post('/partner/:event_id/:account_id', async function(req, res) {
  try {
    let response = null;
    if (req.body.partnerName) {
      response = await accountService.writePartnershipNameToAccount(
        req.params.event_id,
        req.params.account_id,
        req.body.partnerName
      );
    } else if (req.body.partnerWsdcid) {
      response = await accountService.writePartnershipWsdcidToAccount(
        req.params.event_id,
        req.params.account_id,
        req.body.partnerWsdcid
      );
    } else {
    }

    res.sendStatus(HttpResponse.Success);
  } catch (error) {
    res.status(HttpResponse.Conflict).send(error.toString());
  }
});

router.post('/logout', function(req, res) {
  res.clearCookie('x-account');
  res.sendStatus(HttpResponse.Success);
});

router.post('/login', async function(req, res) {
  const reqBody = req.body;
  const email = reqBody.email;
  const password = reqBody.password ? reqBody.password : null;
  const facebookId = reqBody.facebookId ? reqBody.facebookId : null;
  if (!email || (!password && !facebookId)) {
    res
      .status(HttpResponse.NotFound)
      .send('Missing email or password or facebookId');
    return;
  }
  res.cookieHandler.checkOrSetCookie(
    'x-account',
    email,
    Date.now() + CookiesHandler.DefaultExpire
  );

  try {
    const response = await accountService.login(email, password, facebookId);
    res.send(response);
  } catch (error) {
    console.log('Error: ', error);
    res.status(HttpResponse.InternalServerError).send(error.toString());
  }
});

router.get('/login', async function(req, res) {
  if (!res.cookieHandler.hasCookie('x-account')) {
    res.sendStatus(HttpResponse.NotFound);
  } else {
    try {
      const account = await accountService.getAccountByEmail(
        res.cookieHandler.getCookie('x-account')
      );
      // TODO: Convert account to camel cased fields
      if (account.AccountId) {
        res.send(account.toJSON());
      } else {
        res.sendStatus(HttpResponse.NotFound);
      }
    } catch (error) {
      res.sendStatus(HttpResponse.InternalServerError).send(error);
    }
  }
});

router.post('/', async function(req, res) {
  try {
    const updatedAccount = await accountService.upsertAccount(req.body);
    res.send(updatedAccount.toJSON());
  } catch (error) {
    res.status(HttpResponse.InternalServerError).send(error);
  }
});

router.post('/:id', async function(req, res) {
  if (!req.params.id || !req.body) {
    // TODO: Create more full error handling
    res.status(HttpResponse.BadRequest).send('Error: Missing parameters');
    return;
  }
  let { id } = req.params;
  let data = req.body;
  try {
    const updatedAccount = await accountService.updateAccount(id, data);
    res.send(updatedAccount.toJSON());
  } catch (error) {
    res.status(HttpResponse.InternalServerError).send(error);
  }
});
router.get('/:id', async function(req, res) {
  // TODO: this belongs in the account getter
  let { id } = req.params;
  try {
    const account = await accountService.getAccountById(id);

    if (account.AccountId) {
      res.send(account.toJSON());
    } else {
      res.sendStatus(HttpResponse.NotFound);
    }
  } catch (error) {
    res.status(HttpResponse.InternalServerError).send(error);
  }
});
router.get('/', async function(req, res) {
  // TODO: this belongs in the account getter
  let { email } = req.query;

  try {
    const account = await accountService.getAccountByEmail(email);
    if (account.AccountId) {
      res.send(account.toJSON());
    } else {
      res.sendStatus(HttpResponse.NotFound);
    }
  } catch (error) {
    res.status(HttpResponse.InternalServerError).send(error);
  }
});
router.get('/facebook/', async function(req, res) {
  console.log('received content from facebook: ', req.body, req.params);
});

module.exports = router;
