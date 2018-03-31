let express = require('express');
let path = require('path');
let dancers = require('./handlers/dancers');
let wsdc = require ('./handlers/wsdc');
let DB = require('./handlers/db');
let fDB = require('./handlers/fireDB');
let dancerDef = require('./definitions/Dancer');
let accountDef = require('./definitions/Account');
let memcache = require('./middlewares/memcache');
let bodyParser = require('body-parser');
let graph = require('fb-react-sdk');
let CircularJSON = require('circular-json');

let app = express();
let wsdcAPI = wsdc();
let dancersAPI = dancers();
let fireDB = fDB();
var publicDir = path.resolve(__dirname, '../../public');
app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.get('/', function(req, res){
    res.sendFile(publicDir + "/home.html");
});

let cacheControl = (req, res, next) => {
    res.header({
        "Cache-Control": "public,max-age=36000"
    });
    next();
};

app.use(cacheControl);

app.get('/api/dancers/:division/:role', memcache(3600), function(req, res){
    let { division, role } = req.params;
    let { qualifies } = req.query;
    fireDB.GetDancersByDivisionRoleQualifies(division, role, (qualifies === 'true'))
        .then((dancers) => {
            res.send(dancers);
        })
        .catch((error) => {
            res.send({ error });
        });    
});

app.get('/api/dancers/:division', memcache(3600), function(req, res){
    fireDB.GetDancersByDivision(req.params.division);    
});

app.get('/api/dancer/:wscid', memcache(3600), function(req, res){
    wsdcAPI.GetDancer(req.params.wscid)
        .then((result) => {
            let newDancer = new dancerDef();
            newDancer.LoadWSDC(result);
            res.send({constructed: newDancer});
        });
});
app.post('/api/dancer/:wscid', function(req, res){
    wsdcAPI.GetDancer(req.params.wscid)
        .then((result) => {
            let newDancer = new dancerDef();
            newDancer.LoadWSDC(result);
            fireDB.WriteDancerToFirebase(result.wscid, newDancer);
            res.send(newDancer);
        });
});
/*
Commenting this out for future use when the api is fully built.
app.post('/api/account/attend/:event_id/:account_id', function(req, res){
    fireDB.WriteAttendanceToEvent(req.params.event_id, req.params.account_id)
        .then((result) => {
            res.send("Success");        
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});

app.put('/api/account/', function(req, res){
    let account = new accountDef(req.body);
    if(account.HasError()){//Create more full error handling
        res.send("Error");
    }
    fireDB.WriteAccountToFirebase(account)
        .then((result) => {
            res.send(account); 
        })
        .catch((error) => {
            res.send("Error: " + error);  
        });    
});
*/
app.listen(9000, function(){
    console.log("listening to this joint on port 9000");
});