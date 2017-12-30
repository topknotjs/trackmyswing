let dbConfig = require('./dbConfig');
let firebase = require('firebase');
let DancerDef = require('../definitions/Dancer');

class DB{
    constructor(){
        try{
            firebase.initializeApp({
                apiKey: dbConfig.firebase.apiKey,
                authDomain: dbConfig.firebase.authDomain,
                databaseURL: dbConfig.firebase.databaseURL,
                projectId: dbConfig.firebase.projectId,
                storageBucket: dbConfig.firebase.storageBucket,
                messagingSenderId: dbConfig.firebase.messagingSenderId
            });
        }catch(err){
            if (!/already exists/.test(err.message)) {
                console.error('Firebase initialization error', err.stack);
            }
        }
        this.Con = firebase.database();
        this.Authenticate();
    }
    Authenticate(){
        firebase.auth().signInWithEmailAndPassword("kaleb2azriel@gmail.com", "bloodred911")
            .catch(function(sError) {
                console.log("Sign in error: ", sError)
                firebase.auth().createUserWithEmailAndPassword("kaleb2azriel@gmail.com", "bloodred911")
                    .catch((cError) => {
                        console.log("Error with auth: ", cError);
                    });
            });
    }
   
    WriteDancerToFirebase(wscid, dancer){
        this.Con.ref('dancers/' + wscid).set(dancer);
    }
    /**
     * Figure out a key to write the event to the database
     */
    WriteEventToFirebase(){

    }
    GetDancersByDivision(division){
        let ref = this.Con.ref('dancers');
        ref.orderByChild('Division').equalTo('allstar').once('value')
            .then((snapshot) => {
                console.log(snapshot.val());
            });
    }
    //Create synthetic indexes for the division/role/qualifies
    GetDancersByDivisionRoleQualifies(divisionInput, roleInput, qualifies){        
        return new Promise((resolve, reject) => {
            let division = DancerDef.SanitizeDivision(divisionInput),
                role = DancerDef.SanitizeRole(roleInput);
            if(division === null){
                reject("Bad division input.");
                return;
            }
            if(role === null){
                reject("Bad role input.");
                return;
            }
            let key = `${division}-${role}${(qualifies) ? '-q' : ''}`;
            let ref = this.Con.ref('dancers');
            ref.orderByChild('DivisionRoleQualifies').equalTo(key).once('value')
                .then((snapshot) => {
                    let compMap = snapshot.val(), dancersArray = [];
                    for(let key in compMap){
                        dancersArray.push(new DancerDef(compMap[key]));
                    }
                    resolve(dancersArray);
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    reject(error);
                });
        });        
    }
};

module.exports = function(){
    return new DB();
};
