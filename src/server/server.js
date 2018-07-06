let express = require('express');
let path = require('path');
let dancers = require('./handlers/dancers');
let wsdc = require('./handlers/wsdc');
let DB = require('./handlers/db');
let fDB = require('./handlers/fireDB');
let dancerDef = require('./definitions/Dancer');
let accountDef = require('./definitions/Account');
let memcache = require('./middlewares/memcache');
let bodyParser = require('body-parser');
let graph = require('fb-react-sdk');
let CircularJSON = require('circular-json');
const LoggerService = require('./handlers/logger');
const environment = process.env.NODE_ENV.trim();
let logger = new LoggerService();
let app = express();
let wsdcAPI = wsdc();
let dancersAPI = dancers();
let fireDB = fDB();
var publicDir = path.resolve(__dirname, '../../public');

app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.sendFile(publicDir + '/home.html');
});
app.get('/account', function(req, res) {
	res.sendFile(publicDir + '/account.html');
});

app.use((req, res, next) => {
	res.header({
		'Cache-Control': 'max-age=36000',
	});
	next();
});

app.get('/api/dancers/:division/:role', memcache(3600), function(req, res) {
	let { division, role } = req.params;
	let { qualifies } = req.query;
	fireDB
		.GetDancersByDivisionRoleQualifies(division, role, qualifies === 'true')
		.then(dancers => {
            logger.log(`Found ${dancers.length} dancers in division: ${division}, role: ${role}`);
			res.send(dancers);
		})
		.catch(error => {
			logger.error(`Get dancer by division/role error: ${error}`);
			res.send({ error });
		});
});

app.get('/api/dancers/:division', memcache(3600), function(req, res) {
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

app.get('/api/dancer/:wscid', memcache(3600), function(req, res) {
	wsdcAPI
		.GetDancer(req.params.wscid)
		.then(result => {
			logger.info(`Found dancer ${req.params.wscid}`);
			let newDancer = new dancerDef();
			newDancer.LoadWSDC(result);
			res.send({ constructed: newDancer });
		})
		.catch(error => {
			logger.error(`Get dancer ${req.params.wscid} error: ${error}`);
			res.send({ error });
		});
});

app.post('/api/account/attend/:event_id/:account_id', function(req, res){
    fireDB.WriteAttendanceToEvent(req.params.event_id, req.params.account_id)
        .then((result) => {
            res.send("Success");        
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});

app.put('/api/account/', async function(req, res){
	let account = new accountDef(req.body);
	console.log("Found account: ", account);
    if(account.HasError()){//Create more full error handling
        res.send("Error");
	}
	// TODO: this belongs in the account getter
	let dancer = await wsdcAPI.GetDancer(account.Wscid);
	console.log("Found dancer: ", dancer);
    fireDB.WriteAccountToFirebase(account)
        .then((result) => {
            res.send(account); 
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});
app.get('/api/account/facebook/', async function(req, res){
	console.log("received content from facebook: ", req.body, req.params);
});

app.listen(9000, function() {
	console.log('listening to this joint on port 9000');
});
