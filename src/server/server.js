let express = require('express');
let path = require('path');
let dancers = require('./handlers/dancers');
let wsdc = require ('./handlers/wsdc');
let DB = require('./handlers/db');
let fDB = require('./handlers/fireDB');
let dancerDef = require('./definitions/Dancer');
let graph = require('fb-react-sdk');
let CircularJSON = require('circular-json');

let app = express();
let wsdcAPI = wsdc();
let dancersAPI = dancers();
let fireDB = fDB();
var publicDir = path.resolve(__dirname, '../../public');
app.use('/static', express.static('public'));

app.get('/', function(req, res){
    res.sendFile(publicDir + "/home.html");
});

app.get('/api/dancers/:division/:role/:qualifies', function(req, res){
    let { division, role, qualifies } = req.params;
    fireDB.GetDancersByDivisionRoleQualifies(division.toLowerCase(), role.toLowerCase(), (qualifies === 'true'))
        .then((dancers) => {
            res.send(dancers);
        })
        .catch((error) => {
            res.send("Error: ", error);
        });    
});

app.get('/api/dancers/:division/:role', function(req, res){
    let { division, role } = req.params;
    fireDB.GetDancersByDivisionRoleQualifies(division, role, false)
        .then((dancers) => {
            res.send(dancers);
        })
        .catch((error) => {
            res.send({ error });
        });    
});

app.get('/api/dancers/:division', function(req, res){
    fireDB.GetDancersByDivision(req.params.division);    
});

app.get('/api/dancer/store/:wscid', function(req, res){
    wsdcAPI.GetDancer(req.params.wscid)
        .then((result) => {
            let newDancer = new dancerDef(result);
            fireDB.WriteDancerToFirebase(req.params.wscid, newDancer);
            res.send(newDancer);
        });
});

app.get('/api/dancer/find/:wscid', function(req, res){
    wsdcAPI.GetDancer(req.params.wscid)
        .then((result) => {
            let newDancer = new dancerDef(result);
            res.send({constructed: newDancer});
        });
});
app.get('/api/facebooklogin', function(req, res){
    var authUrl = graph.getOauthUrl({
        "client_id": "534047486965274",
        "redirect_uri": "http://trackmyswing.andrewsunada.com/api/facebookredirect"
    });
    res.redirect(authUrl);
});
app.get('/api/facebookredirect', function(req, res){
    console.log(CircularJSON.stringify(req.query));
    graph.authorize({
        "client_id": "534047486965274",
        "redirect_uri": "http://trackmyswing.andrewsunada.com/api/facebookredirect",
        "client_secret": "d158c7edf3613d98cb02cc38e10eb1d4",
        "code": req.code
    }, function(err, facebookRes){
        res.redirect('/loggedIn');
    });
});
app.get("/loggedIn", function(req, res){
    let query = "SELECT name FROM user WHERE uid = me()";
    graph.fql(query, function(err, graphRes){
        console.log(res);
        res.send("Logged in");
    });    
});
app.listen(9000, function(){
    console.log("listening to this joint on port 9000");
});