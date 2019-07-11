const wsdc = require('../handlers/wsdc');
const LoggerService = require('../handlers/logger');
const dancerDef = require('../definitions/Dancer');
const fDB = require('../handlers/fireDB');
let logger = new LoggerService();
class DancersService {
  constructor() {
    this.wsdcAPI = wsdc();
    this.fireDB = fDB();
  }

  async getAccountsAndDancersByDivisionRole(division, role) {
    try {
      const accounts = await this.fireDB.getAccountsByDivisionRoleQualifies(
        division,
        role,
        true
      );
      const dancers = await this.fireDB.getDancersByDivisionRoleQualifies(
        division,
        role,
        true
      );
      const accountsAndDancers = accounts.splice(0);
      const dancerIdsInAccounts = accounts.reduce((acc, account) => {
        acc.push(account.WsdcDancer.WSDCID);
      }, []);
      for (let i = 0, len = dancers.length; i < len; i++) {
        if (dancerIdsInAccounts.indexOf(dancers[i].WSDCID) === -1) {
          accountsAndDancers.push(dancers[i]);
        }
      }
      // logger.info(`Found dancer ${wsdcid}`);
      return accountsAndDancers;
    } catch (error) {
      // logger.error(`Get dancer ${wsdcid} error: ${error}`);
      res.send(error);
    }
  }
}

module.exports = DancersService;
