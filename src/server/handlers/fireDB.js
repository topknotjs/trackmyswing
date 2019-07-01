let dbConfig = require('./dbConfig');
let firebase = require('firebase');
let DancerDef = require('../definitions/Dancer');
let AccountDef = require('../definitions/Account');
let sanitizeEmail = require('../utils/sanitizeEmail');

const getSingleValueFromSnapshot = snapshot => {
	for (let key in snapshot) {
		return snapshot[key];
	}
};
const getSingleKeyFromSnapshot = snapshot => {
	for (let key in snapshot) {
		return key;
	}
};
class DB {
	constructor() {
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
		this.Con = firebase.database();
		this.Authenticate();
		this.Con.ref()
			.once('value')
			.then(function(snap) {
				//console.log('snap.val(): ', snap.val());
			});
	}
	Authenticate() {
		firebase
			.auth()
			.signInWithEmailAndPassword(
				dbConfig.firebase.username,
				dbConfig.firebase.password
			)
			.catch(function(sError) {
				console.log('Sign in error: ', sError);
				firebase
					.auth()
					.createUserWithEmailAndPassword(
						dbConfig.firebase.username,
						dbConfig.firebase.password
					)
					.catch(cError => {
						console.log('Error with auth: ', cError);
					});
			});
	}

	WriteDancerToFirebase(wsdcid, dancer) {
		this.Con.ref('dancers/' + wsdcid).set(dancer);
	}
	WriteEventsToFirebase(events) {
		return new Promise((resolve, reject) => {
			let eventMap = {};
			let ref = this.Con.ref('events/');
			let promises = [];
			events.forEach(event => {
				//console.log("Writing event: ", event);
				let currProm = new Promise((eResolve, eReject) => {
					ref.child(event.GetKey()).set(event, () => eResolve());
				});
				promises.push(currProm);
			});
			Promise.all(promises).then(() => resolve());
		});
	}
	GetEvents() {
		return new Promise((resolve, reject) => {
			this.Con.ref('events')
				.once('value')
				.then(snapshot => {
					//console.log("Events: ", snapshot.val());
					resolve(snapshot.val());
				});
		});
	}
	GetEvent(id) {
		return new Promise((resolve, reject) => {
			this.Con.ref('events/' + id)
				.once('value')
				.then(snapshot => {
					resolve(snapshot.val());
				})
				.catch(error => {
					console.log('Event error: ', error);
					reject(error);
				});
		});
	}
	// TODO: Make updating events available when necessary
	// UpdateEvent(id, data){

	// 	return new Promise((resolve, reject) => {
	// 		this.GetEvent(id)
	// 			.then(snapshot => {
	// 				let event =
	// 				return this.Con.ref('events/' + eventkey).set(event, () => resolve());
	// 			})
	// 			.catch(error => {
	// 				console.log("Error updating event: ", error);
	// 				reject(error);
	// 			});
	// 	});
	// }
	/**
	 * Figure out a key to write the event to the database
	 */
	WriteEventToFirebase(eventkey, event) {
		return new Promise((resolve, reject) => {
			this.Con.ref('events/' + eventkey).set(event, () => resolve());
		});
	}
	writeAccountToFirebase(account) {
		return new Promise((resolve, reject) => {
			const ref = this.Con.ref('accounts').push();
			ref.then(() => {
				ref.set({
					...account.toJSON(true),
					accountId: ref.key,
				});
				resolve(ref.key);
			}).catch(error => {
				console.log('Found write account error: ', error);
				reject(error);
			});
			// this.Con.ref('accounts').push(account.toJSON(true), value => {
			// 	console.log('Wrote account: ', value);
			// 	resolve();
			// });
		});
	}
	// TODO: Error handle when id does not exist
	updateAccountInFirebase(id, data) {
		// TODO: Consider creating a method of validating account data other than creating an account object
		return new Promise((resolve, reject) => {
			if (!AccountDef.ValidateAccount(data)) {
				reject('Invalid account data');
				return;
			}
			const accountUpdateData = new AccountDef(data).toJSON();
			let updatedAccount = null;
			// TODO: Move this logic into the account service rather than doing it all in the firebase handler
			this.getAccountById(id)
				.then(updateableAccount => {
					const updateableAccountData = updateableAccount.toJSON();
					for (let key in accountUpdateData) {
						if (
							!accountUpdateData.hasOwnProperty(key) ||
							!accountUpdateData.hasOwnProperty(key) ||
							!accountUpdateData[key]
						) {
							continue;
						}
						updateableAccountData[key] = accountUpdateData[key];
					}
					updatedAccount = updateableAccountData;
					return this.Con.ref('accounts/' + id).set(
						updateableAccountData
					);
				})
				.then(result => {
					resolve(new AccountDef(updatedAccount));
				})
				.catch(error => {
					console.log('Error: ', error);
					reject(error);
				});
		});
	}
	async writeAccountToEvent(eventId, accountId) {
		return new Promise((resolve, reject) => {
			this.Con.ref('eventAttendees/' + eventId)
				.orderByChild('accountId')
				.equalTo(accountId)
				.once('value', snapshot => {
					if (snapshot.exists()) {
						//Add logging here
						const message = `${eventId} for ${accountId} already exists`;
						reject(message);
					} else {
						console.log('Pushing: ', accountId);
						this.Con.ref('eventAttendees/' + eventId + '/').push(
							{ accountId },
							() => resolve(accountId)
						);
					}
				});
		});
	}
	async getAccountById(id) {
		return new Promise((resolve, reject) => {
			this.Con.ref(`accounts/${id}`)
				.once('value')
				.then(snapshot => {
					const accountData = snapshot.val();
					if (!accountData) {
						reject(`Account ${id} not found`);
						return;
					}
					resolve(
						new AccountDef({
							...accountData,
							accountId: id,
						})
					);
				})
				.catch(error => {
					console.log(`Getting account ${id} error: ${error}`);
					reject(error);
				});
		});
	}
	async getAccountByEmail(email) {
		return new Promise((resolve, reject) => {
			this.Con.ref(`accounts`)
				.orderByChild('email')
				.equalTo(email)
				.once('value')
				.then(snapshot => {
					const accountRaw = snapshot.val();
					// TODO: Check for errors from account def here
					if (!accountRaw) {
						resolve(null);
					} else {
						resolve(
							new AccountDef(
								getSingleValueFromSnapshot(accountRaw)
							)
						);
					}
				})
				.catch(error => {
					console.log(`Getting account ${id} error: ${error}`);
					reject(error);
				});
		});
	}
	GetDancersByDivision(division) {
		return new Promise((resolve, reject) => {
			let ref = this.Con.ref('dancers');
			ref.orderByChild('Division')
				.equalTo(DancerDef.SanitizeDivision(division))
				.once('value')
				.then(snapshot => {
					console.log(snapshot.val());
					resolve(snapshot.val());
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	//Create synthetic indexes for the division/role/qualifies
	GetDancersByDivisionRoleQualifies(divisionInput, roleInput, qualifies) {
		return new Promise((resolve, reject) => {
			let division = DancerDef.SanitizeDivision(divisionInput),
				role = DancerDef.SanitizeRole(roleInput);
			if (division === null) {
				reject('Bad division input.');
				return;
			}
			if (role === null) {
				reject('Bad role input.');
				return;
			}
			let ref = this.Con.ref('dancers');
			const keys = [`${division}-${role}`, `${division}-${role}-q`],
				queries = [];
			if (qualifies && DancerDef.IsPreviousDivisionAvailable(division)) {
				keys.push(
					`${DancerDef.SanitizeDivision(
						DancerDef.GetPreviousDivision(division)
					)}-${role}-q`
				);
			}
			keys.forEach(key => {
				queries.push(
					ref
						.orderByChild('DivisionRoleQualifies')
						.equalTo(key)
						.once('value')
				);
			});
			Promise.all(queries)
				.then(snapshots => {
					let compMap = snapshots.reduce((acc, snapshot) => {
							if (!snapshot.val()) {
								return acc;
							}
							return acc.concat(Object.values(snapshot.val()));
						}, []),
						dancersArray = [];
					for (let key in compMap) {
						const newDancer = new DancerDef(compMap[key]);
						if (newDancer.Relevance <= 2) {
							dancersArray.push(newDancer);
						}
					}
					dancersArray.sort((a, b) => {
						const la = a.LastName.toLowerCase(),
							lb = b.LastName.toLowerCase();
						if (la < lb) return -1;
						else if (la > lb) return 1;
						return 0;
					});
					resolve(dancersArray);
				})
				.catch(error => {
					console.log('Error: ', error);
					reject(error);
				});
		});
	}
	async loginAccount(email, password, facebookId) {
		return new Promise((resolve, reject) => {
			let ref = this.Con.ref('accounts');
			ref.orderByChild('email')
				.equalTo(sanitizeEmail(email))
				.once('value')
				.then(snapshot => {
					const accountRaw = snapshot.val();
					const key = getSingleKeyFromSnapshot(accountRaw);
					const account = getSingleValueFromSnapshot(accountRaw);
					if (password) {
						if (
							AccountDef.CheckPasswordAgainstHashed(
								password,
								account.password
							)
						) {
							resolve(key);
						} else {
							reject('Invalid password');
						}
					} else if (facebookId) {
						if (facebookId === account.facebookId) {
							resolve(key);
						} else {
							reject('Invalid facebookId');
						}
					}
				})
				.catch(error => {
					reject(error);
				});
		});
	}
}

module.exports = function() {
	return new DB();
};
