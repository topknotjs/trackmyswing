const Dancer = require('./Dancer');
const Event = require('./Event');
class Attendance {
	constructor(data) {
		this.event = data.hasOwnProperty('event')
			? new Event(data.event)
			: null;
		this.partnerName = data.hasOwnProperty('partnerName')
			? data.partnerName
			: '';
		this.partnerDancer = data.hasOwnProperty('partnerDancer')
			? new Dancer(data.partnerDancer)
			: null;
		this.error = false;
	}
	toJSON() {
		return {
			event: this.event === null ? null : this.event.toJSON(),
			partnerName: this.partnerName,
			partnerDancer:
				this.partnerDancer === null
					? null
					: this.partnerDancer.toJSON(),
		};
	}
	addEvent(event) {
		this.event = event;
	}
	addPartner(partner) {
		if (partner instanceof Dancer) {
			this.addPartnerDancer(partner);
		} else {
			this.addPartnerName(partner);
		}
	}
	addPartnerDancer(dancer) {
		this.partnerDancer = dancer;
	}
	addPartnerName(name) {
		this.partnerName = name;
	}
}

module.exports = Attendance;
