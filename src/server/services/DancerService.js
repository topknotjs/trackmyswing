const wsdc = require('../handlers/wsdc');
const LoggerService = require('../handlers/logger');
const dancerDef = require('../definitions/Dancer');
const fDB = require('../handlers/fireDB');
let logger = new LoggerService();
class DancerService {
	constructor() {
		this.wsdcAPI = wsdc();
		this.fireDB = fDB();
	}

	async getDancer(wsdcid) {
		try {
			const dancer = await this.fireDB.getDancer(wsdcid);
			console.log('DancerService: ', dancer);
			logger.info(`Found dancer ${wsdcid}`);
			return dancer;
		} catch (error) {
			logger.error(`Get dancer ${wsdcid} error: ${error}`);
			res.send({ error });
		}
	}
	async getWsdcDancer(wsdcid) {
		try {
			const dancer = await this.wsdcAPI.getDancer(wsdcid);
			logger.info(`Found dancer ${wsdcid}`);
			let newDancer = new dancerDef();
			newDancer.LoadWSDC(dancer);
			return newDancer;
		} catch (error) {
			logger.error(`Get dancer ${wsdcid} error: ${error}`);
			res.send({ error });
		}
	}
	async processWsdcDancer(wsdcid) {
		try {
			const dancer = await this.wsdcAPI.getDancer(wsdcid);
			logger.info(`Found dancer ${wsdcid}`);
			let newDancer = new dancerDef();
			newDancer.LoadWSDC(dancer);
			this.fireDB.writeDancerToFirebase(newDancer);
			return newDancer;
		} catch (error) {
			logger.error(`Get dancer ${wsdcid} error: ${error}`);
			res.send({ error });
		}
	}
}

module.exports = DancerService;
