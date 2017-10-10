let dbConfig = require('./dbConfig');
let firebase = require('firebase');

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
    };
};

module.exports = function(){
    return new DB();
};
