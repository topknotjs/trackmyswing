let dbConfig = require('./dbConfig');
let mysql = require('mysql');
let firebase = require('firebase');
const DB = function() {
	this.MysqlCon = mysql.createConnection({
		host: dbConfig.mysql.host,
		user: dbConfig.mysql.username,
		password: dbConfig.mysql.password,
		database: dbConfig.mysql.dbname,
	});
	try {
		firebase.initializeApp({
			apiKey: dbConfig.firebase.apiKey,
			authDomain: dbConfig.firebase.authDomain,
			databaseURL: dbConfig.firebase.databaseURL,
			projectId: dbConfig.firebase.projectId,
			storageBucket: dbConfig.firebase.storageBucket,
			messagingSenderId: dbConfig.firebase.messagingSenderId,
		});
	} catch (err) {
		if (!/already exists/.test(err.message)) {
			console.error('Firebase initialization error', err.stack);
		}
	}

	this.FirebaseCon = firebase.database();

	this.executeQuery = function(sql) {
		this.MysqlCon.connect(function(err) {
			if (err) throw err;
		});
		let promise = new Promise((resolve, reject) => {
			this.MysqlCon.query(sql, (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
		return promise;
	};
	this.writeDancerToFirebase = function(wsdcid, dancer) {
		this.FirebaseCon.ref('dancers/' + wsdcid).set(JSON.parse(dancer));
	};
};

module.exports = DB;
