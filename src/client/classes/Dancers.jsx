export default class Dancer {
	constructor(data) {
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.wsdcid = data.wsdcid;
		this.currentPoints = data.currentPoints;
		this.division = data.division;
		this.role = data.role;
		this.qualifiesforNextDivision = data.qualifiesforNextDivision;
	}
}
