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
        this.Con.ref().once('value')
            .then(function (snap) {
                //console.log('snap.val(): ', snap.val());
            });
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
    WriteEventsToFirebase(events){
        return new Promise((resolve, reject) => {
            let eventMap = {};
            let ref = this.Con.ref('events/');
            let promises = [];
            events.forEach((event) => {
                //console.log("Writing event: ", event);
                let currProm = new Promise((eResolve, eReject) => {
                    ref.child(event.GetKey()).set(event, () => eResolve());
                });
                promises.push(currProm);
            });
            Promise.all(promises).then(() => resolve());
        });
    }
    GetEvents(){
        return new Promise((resolve, reject) => {
            this.Con.ref('events').once('value')
                .then((snapshot) => {
                    //console.log("Events: ", snapshot.val());
                    resolve(snapshot.val());
                });
        });
    }
    /**
     * Figure out a key to write the event to the database
     */
    WriteEventToFirebase(eventkey, event){
        return new Promise((resolve, reject) => {
            this.Con.ref('events/' + eventkey).set(event, () => resolve());
        });        
    }
    WriteAccountToFirebase(account){
        return new Promise((resolve, reject) => {
            this.Con.ref('accounts').push(account.toJSON(), () => resolve());
        });
    }
    WriteAttendanceToEvent(eventId, accountId){
        return new Promise((resolve, reject) => {
            this.Con.ref('eventAttendees/' + eventId).orderByChild('accountId').equalTo(accountId).once('value', (snapshot) => {
                if(snapshot.exists()){//Add logging here
                    console.log("Already exists!");
                    reject("Exists");
                }else{
                    console.log("Pushing: ", accountId);
                    this.Con.ref('eventAttendees/' + eventId + '/').push({ accountId }, () => resolve(accountId));
                }
            });            
        });
    }
    TestCon(){
        return new Promise((resolve, reject) => {
            console.log("set");
            this.Con.ref('test/').set({test: true}, (res) => {
                console.log("Set complete!: ", res);
                
            });
        });
    }
    GetDancersByDivision(division){
        let ref = this.Con.ref('dancers');
        ref.orderByChild('Division').equalTo(DancerDef.SanitizeDivision(division)).once('value')
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
