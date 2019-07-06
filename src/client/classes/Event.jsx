export class Event {
	constructor({ data, attendance }) {
		this.eventId = data.hasOwnProperty('eventId') ? data.eventId : '';
		this.eventName = data.hasOwnProperty('eventName') ? data.eventName : '';
		this.singleDay = data.hasOwnProperty('singleDay')
			? data.singleDay
			: false;

		this.startDate = data.hasOwnProperty('startDate')
			? new Date(data.startDate)
			: null;
		this.endDate = data.hasOwnProperty('endDate')
			? new Date(data.endDate)
			: null;
		this.hotelAddress = data.hasOwnProperty('hotelAddress')
			? data.hotelAddress
			: '';
		this.hotelUrl = data.hasOwnProperty('hotelUrl') ? data.hotelUrl : '';
		this.eventUrl = data.hasOwnProperty('eventUrl') ? data.eventUrl : '';
		this.contactName = data.hasOwnProperty('contactName')
			? data.contactName
			: '';
		this.contactNumber = data.hasOwnProperty('contactNumber')
			? data.contactNumber
			: '';
		this.contactEmail = data.hasOwnProperty('contactEmail')
			? data.contactEmail
			: '';
		this.attending = false;
		this.partnered = false;
		this.partnerName = false;
		this.partnerDancer = false;
		if (attendance !== null) {
			this.attending = true;
			if (attendance.partnerDancer) {
				this.partnered = true;
				this.partnerDancer = attendance.partnerDancer;
			} else if (attendance.partnerName) {
				this.partnered = true;
				this.partnerName = attendance.partnerName;
			}
		}
	}
}
