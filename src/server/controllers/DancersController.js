const express = require('express');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');
const DancersService = require('../services/DancersService');
const HttpResponse = require('../definitions/HttpResponse');

let fireDB = fDB();
let logger = new LoggerService();
const dancersService = new DancersService();
const router = express.Router();

router.get('/complete/:division/:role', async function(req, res) {
  let { division, role } = req.params;
  let { qualifies } = req.query;
  try {
    const dancers = await dancersService.getAccountsAndDancersByDivisionRole(
      division,
      role
    );
    res.send(dancers);
  } catch (error) {
    res.status(HttpResponse.InternalServerError).send(error);
  }
});
router.get('/:division/:role', function(req, res) {
  let { division, role } = req.params;
  let { qualifies } = req.query;
  fireDB
    .GetDancersByDivisionRole(division, role)
    .then(dancers => {
      logger.log(
        `Found ${
          dancers.length
        } dancers in division: ${division}, role: ${role}`
      );
      res.send(dancers);
    })
    .catch(error => {
      logger.error(`Get dancer by division/role error: ${error}`);
      res.send({ error });
    });
});

router.get('/:division', function(req, res) {
  fireDB
    .GetDancersByDivision(req.params.division)
    .then(dancers => {
      logger.info(`Found ${dancers.length} dancers in division: ${division}`);
      res.send(dancers);
    })
    .catch(error => {
      logger.error(`Get dancer by division error: ${error}`);
      res.send({ error });
    });
});

module.exports = router;
