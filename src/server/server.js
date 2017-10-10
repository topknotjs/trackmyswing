let express = require('express');
let path = require('path');
let dancers = require('./handlers/dancers');
let wsdc = require ('./handlers/wsdc');
let DB = require('./handlers/db');
let fDB = require('./handlers/fireDB');
let dancerDef = require('./definitions/Dancer');

let app = express();
let wsdcAPI = wsdc();
let dancersAPI = dancers();
let db = new DB();
let fireDB = fDB();
var publicDir = path.resolve(__dirname, '../../public');
app.use('/static', express.static('public'));

app.get('/', function(req, res){
    res.sendFile(publicDir + "/home.html");
});

app.get('/dancers/:division/:role', function(req, res){
    let listPromise = dancersAPI.getDancers(req.params.division, req.params.role);    
    listPromise.then((results) => {
        res.send('Testing: ' + JSON.stringify(results));
    });
});

app.get('/dancer/store/:wscid', function(req, res){
    wsdcAPI.GetDancer(req.params.wscid)
        .then((result) => {
            let newDancer = new dancerDef(result);
            fireDB.WriteDancerToFirebase(req.params.wscid, newDancer);
            res.send(newDancer);
        });
});

app.get('/dancer/find/:wscid', function(req, res){
    wsdcAPI.GetDancer(req.params.wscid)
        .then((result) => {
            let newDancer = new dancerDef(result);
            res.send({constructed: newDancer});
        });
});

app.listen(3000, function(){
    console.log("listening to this joint on port 3000");
});