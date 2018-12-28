const express = require('express');
const fDB = require('../handlers/fireDB');
const LoggerService = require('../handlers/logger');

let fireDB = fDB();
let logger = new LoggerService();

const router = express.Router();

router.get('/:division/:role', function(req, res) {
	let { division, role } = req.params;
	let { qualifies } = req.query;
	fireDB
		.GetDancersByDivisionRoleQualifies(division, role, qualifies === 'true')
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
			logger.info(
				`Found ${dancers.length} dancers in division: ${division}`
			);
			res.send(dancers);
		})
		.catch(error => {
			logger.error(`Get dancer by division error: ${error}`);
			res.send({ error });
		});
});

module.exports = router;
