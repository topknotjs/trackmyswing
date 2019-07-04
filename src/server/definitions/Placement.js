class Placement {
	constructor(data) {
		this.role = '';
		this.points = '';
		this.eventName = '';
		this.eventLocation = '';
		this.eventDate = '';
		this.result = '';
		if (!data) {
			return;
		}
		this.processFB(data);
	}
	toJSON() {
		return {
			role: this.role,
			points: this.points,
			eventName: this.eventName,
			eventLocation: this.eventLocation,
			eventDate: this.eventDate,
			result: this.result,
		};
	}
	processFB(data) {
		this.role = data.role;
		this.points = data.points;
		this.eventName = data.eventName;
		this.eventLocation = data.eventLocation;
		this.eventDate = data.eventDate;
		this.result = data.result;
	}
	processWSDC(data) {
		this.role = data.role;
		this.points = data.points;
		this.eventName = data.event.name;
		this.eventLocation = data.event.location;
		this.eventDate = data.event.date;
		this.result = data.result;
	}
}

module.exports = Placement;
