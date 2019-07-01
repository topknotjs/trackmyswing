const wsdc = require('../handlers/wsdc');
const LoggerService = require('../handlers/logger');
const dancerDef = require('../definitions/Dancer');
const wsdcAPI = wsdc();
let logger = new LoggerService();
class DancerService {
	constructor() {
		this.wsdcAPI = wsdc();
	}

	async getDancer(wsdcid) {
		try {
			const dancer = await this.wsdcAPI.GetDancer(wsdcid);
			logger.info(`Found dancer ${wsdcid}`);
			let newDancer = new dancerDef();
			newDancer.LoadWSDC(dancer);
			return newDancer;
		} catch (error) {
			logger.error(`Get dancer ${wsdcid} error: ${error}`);
			res.send({ error });
		}
	}
}

module.exports = DancerService;
