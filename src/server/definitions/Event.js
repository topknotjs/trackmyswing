// TODO: Add error logging
// TODO: Make the constructor parse what's coming from the database and a separate method for parsing wsdc crap
class Event {
	constructor(data) {
		this.EventId = null;
		this.EventName = null;
		this.SingleDay = false;
		this.StartDate = null;
		this.EndDate = null;
		this.HotelAddress = null;
		this.HotelUrl = null;
		this.ContactName = null;
		this.ContactNumber = null;
		this.ContactEmail = null;
		if (!data) return;
		this.processEventName(data.event_name);
		this.processContact(data.contact);
		this.processName(data.event_name);
		this.processDate(data.date);
		this.processLocation(data.location);
		this.processContact(data.contact);
		this.processEventId();
	}
	processFBData(data) {
		this.EventId = data.eventId;
		this.EventName = data.eventName;
		this.SingleDay = data.singleDay;
		this.StartDate = new Date(data.startDate);
		this.EndDate = new Date(data.endDate);
		this.HotelAddress = data.hotelAddress;
		this.HotelUrl = data.hotelUrl;
		this.ContactName = data.contactName;
		this.ContactNumber = data.contactNumber;
		this.ContactEmail = data.contactEmail;
	}
	processEventName(text) {
		this.EvenName = text.trim();
	}
	processContact(text) {
		let matched = false;
		text.replace(
			/^([^0-9\+]*)(.*)<a.*>(.*)<\//,
			(match, $1, $2, $3, offset, original) => {
				matched = true;
				this.ContactName = Event.SanitizeData($1);
				this.ContactNumber = Event.SanitizeData($2.trim());
				this.ContactEmail = Event.SanitizeData($3.trim());
			}
		);
		if (!matched) {
			//console.log("Unmatched: ", text);
		}
	}
	processLocation(text) {
		text.replace(/^(.*)<a/, (match, $1, offset, original) => {
			this.HotelAddress = Event.SanitizeData($1);
		});
		text.replace(/^.*href=\'(.*)\'/, (match, $1, $offset, original) => {
			this.HotelUrl = Event.SanitizeData($1);
		});
	}
	processName(text) {
		this.EventName = text.replace(/\s\s+/g, ' ').trim();
	}
	processDate(text) {
		let regexMatch = null,
			startDate = null,
			endDate = null;
		text.replace(
			/([A-Za-z]+) ([0-9]+)(, [0-9]+)? - ([A-Za-z]+)?\s?([0-9]+), ([0-9]{4})/,
			(match, $1, $2, $3, $4, $5, $6, offset, original) => {
				if ($3 !== undefined && $3.includes(',')) {
					$3.replace(/([0-9]+)/, (match, $1, offset, original) => {
						$3 = $1;
					});
				}
				let startMonth = $1;
				let startDay = $2;
				let endYear = $6;
				let endMonth = $4 === undefined ? startMonth : $4;
				let endDay = $5;
				let startYear = $3 === undefined ? endYear : $3;
				startDate = new Date(`${startMonth} ${startDay}, ${startYear}`);
				endDate = new Date(`${endMonth} ${endDay}, ${endYear}`);
				regexMatch = match;
			}
		);
		if (regexMatch === null) {
			text.replace(
				/([A-Za-z]+) ([0-9]+), ([0-9]{4})/,
				(match, $1, $2, $3, offset, original) => {
					startDate = endDate = new Date(`${1} ${2}, ${3}`);
					this.SingleDay = true;
				}
			);
		}
		this.StartDate = startDate;
		this.EndDate = endDate;
	}
	processEventId() {
		this.EventId = this.getKey();
	}
	getKey() {
		return (
			this.StartDate.getFullYear() +
			'-' +
			this.EventName.toLowerCase().replace(/[^a-z]/g, '')
		);
	}
	toJSON() {
		return {
			eventId: this.EventId,
			eventName: this.EventName,
			singleDay: this.SingleDay,
			startDate: this.StartDate.toLocaleDateString('en-US'),
			endDate: this.EndDate.toLocaleDateString('en-US'),
			hotelAddress: this.HotelAddress,
			hotelUrl: this.HotelUrl,
			contactName: this.ContactName,
			contactNumber: this.ContactNumber,
			contactEmail: this.ContactEmail,
		};
	}
	static SanitizeRaw(text) {
		return text.replace(/<br>/g, '').replace(/\n/g, '');
	}
	static SanitizeData(text) {
		return text.replace(/\s\s+/g, ' ').trim();
	}
}
module.exports = Event;
