let express = require('express');
let path = require('path');
let dancersConfig = require('./handlers/dancers');

let app = express();
var publicDir = path.resolve(__dirname, '../../public');
app.use('/static', express.static('public'));

app.get('/', function(req, res){
    res.sendFile(publicDir + "/home.html");
});

app.get('/dancers/:division/:role', function(req, res){
    let listPromise = dancersConfig.getDancers(req.params.division, req.params.role);    
    listPromise.then((results) => {
        res.sendFile('Testing: ' + JSON.stringify(results));
    });
});

app.listen(3000, function(){
    console.log("listening to this joint on port 3000");
});