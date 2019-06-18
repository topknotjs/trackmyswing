const fDB = require('../handlers/fireDB');
class AccountServices {
	constructor() {
		this.fireDB = fDB();
	}
	async writeAttendanceToEvent(eventId, accountId) {
		try {
			return await this.fireDB.writeAccountToEvent(eventId, accountId);
		} catch (error) {
			console.log('Error: ', error);
			throw new Error(error);
		}
	}
}

module.exports = AccountServices;
