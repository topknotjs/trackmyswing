/**
 * The intention with this script is to pull a full list of all dancers as quickly as possible.
 * The current problem is that the wsdc service shuts down after too many requests per second.
 * Solutions:
 *  - HTTP2 batch requests?
 *  - Discover better throttle options
 */
let wsdcConfig = require('../handlers/wsdc');
let fDB = require('../handlers/fireDB');
let dancerDef = require('../definitions/Dancer');
const LoggerService = require('../handlers/logger');
let wsdc = wsdcConfig();
let fireDB = fDB();
let finish = () => {
  process.exit('Finished!');
};
const logger = new LoggerService();
let begin = i => {
  return wsdc
    .GetDancers()
    .then(results => {
      processDancerValues(results)
        .then(() => {
          finish();
        })
        .catch(error => {
          logger.log(`Process error: ${error}`);
          finish();
        });
    })
    .catch(error => {
      if (i <= 0) {
        logger.log(`Get dancer failure: ${error}`);
      } else {
        logger.log('Get dancer error. Retrying in 3 seconds.');
        setTimeout(() => {
          begin(i - 1);
        }, 3000);
      }
    });
};
let processDancerValues = results => {
  return new Promise((resolve, reject) => {
    let fetchDancers = dancerSet => {
      let nextPromise = new Promise((resolve, reject) => {
        let i = 0,
          promises = [];
        while (i < dancerSet.length) {
          let ci = dancerSet[i++];
          while (!ci.hasOwnProperty('value')) {
            ci = dancerSet[i++];
          }
          promises.push(wsdc.getDancer(ci.value));
        }
        Promise.all(promises)
          .then(results => {
            results.forEach(result => {
              if (
                !result.hasOwnProperty('dancer') ||
                !result.dancer.hasOwnProperty('wscid')
              )
                return;
              let dancer = new dancerDef();
              dancer.LoadWSDC(result);
              if (dancer.error !== false) {
                logger.log('Found error: ', dancer.error);
                return;
              }
              logger.log(
                `Loading dancer ${dancer.wsdcId} => ${JSON.stringify(dancer)}`
              );
              fireDB.writeDancerToFirebase(dancer);
            });
            resolve('done');
          })
          .catch(error => {
            reject(error);
            logger.error(`Problem with promise set: ${error}`);
          });
      });
      return nextPromise;
    };

    let run = (i, step) => {
      if (step == 0) {
        logger.log('Exit 1');
        resolve();
        return;
      } else if (i + step >= results.length) {
        logger.log(
          `Exit 2 - [i: ${i} step: ${step} length: ${results.length}]`
        );
        let increment = results.length - i - 1;
        run(i, increment);
        return;
      }
      logger.log(`Fetching: ${i} - ${i + step}`);
      fetchDancers(results.slice(i, i + step))
        .then(() => {
          setTimeout(() => {
            run(i + step, step);
          }, 2000);
        })
        .catch(error => {
          reject(error);
        });
    };
    run(0, 10);
  });
};

begin(3);
