let express = require('express');
let path = require('path');
const DancersController = require('./controllers/DancersController');
const DancerController = require('./controllers/DancerController');
const AccountController = require('./controllers/AccountController');
const EventsController = require('./controllers/EventsController');
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

// if(environment === 'production'){
// 	app.use('/static', express.static(_dirname + '/public'));
// }else{
// 	app.use('/static', express.static(_dirname));
// }

app.use(express.static(publicDir));

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

app.use('/api/dancers', memcache(3600), DancersController);

app.use('/api/dancer', memcache(3600), DancerController);

app.use('/api/account', AccountController);
app.use('/api/events', EventsController);

app.listen(8080, function() {
	console.log('listening to this joint on port 9000');
});
