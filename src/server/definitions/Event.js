// TODO: Add error logging
// TODO: Make the constructor parse what's coming from the database and a separate method for parsing wsdc crap
class Event {
	constructor(data) {
		this.eventId = '';
		this.eventName = '';
		this.singleDay = false;
		this.startDate = null;
		this.endDate = null;
		this.hotelAddress = '';
		this.hotelUrl = '';
		this.eventUrl = '';
		this.contactName = '';
		this.contactNumber = '';
		this.contactEmail = '';
		if (!data) return;
	}
	processWsdcExportData(data) {
		this.processEventName(data.event_name);
		this.processContact(data.contact);
		this.processDate(data.date);
		this.processLocation(data.location);
		this.processContact(data.contact);
		this.processEventId();
	}
	processParsedCalendarData(data) {
		this.processEventName(data.title);
		this.startDate = new Date(data.start);
		this.endDate = new Date(data.end);
		this.eventUrl = data.url;
	}
	processFBData(data) {
		this.eventId = data.eventId;
		this.eventName = data.eventName;
		this.singleDay = data.singleDay;
		this.startDate = new Date(data.startDate);
		this.endDate = new Date(data.endDate);
		this.hotelAddress = data.hotelAddress;
		this.hotelUrl = data.hotelUrl;
		this.eventUrl = data.eventUrl;
		this.contactName = data.contactName;
		this.contactNumber = data.contactNumber;
		this.contactEmail = data.contactEmail;
	}
	processEventName(text) {
		const possibleSuffix = [
			'Registry',
			'Member',
			'Trial',
			'Multi',
			'Training',
		];
		text = text.replace(/\s\s+/g, ' ').trim();
		for (let i = 0, len = possibleSuffix.length; i < len; i++) {
			const fullSuffix = ` - ${possibleSuffix[i]}`;
			if (text.indexOf(fullSuffix) !== -1) {
				text = text.substring(0, text.indexOf(fullSuffix));
			}
		}
		if (text.match(/\s-\s*$/)) {
			this.eventName = text.replace(/\s-\s*$/, '');
		} else {
			this.eventName = text.trim();
		}
	}
	processContact(text) {
		let matched = false;
		text.replace(
			/^([^0-9\+]*)(.*)<a.*>(.*)<\//,
			(match, $1, $2, $3, offset, original) => {
				matched = true;
				this.contactName = Event.SanitizeData($1);
				this.contactNumber = Event.SanitizeData($2.trim());
				this.contactEmail = Event.SanitizeData($3.trim());
			}
		);
		if (!matched) {
			//console.log("Unmatched: ", text);
		}
	}
	processLocation(text) {
		text.replace(/^(.*)<a/, (match, $1, offset, original) => {
			this.hotelAddress = Event.SanitizeData($1);
		});
		text.replace(/^.*href=\'(.*)\'/, (match, $1, $offset, original) => {
			this.hotelUrl = Event.SanitizeData($1);
		});
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
					this.singleDay = true;
				}
			);
		}
		this.startDate = startDate;
		this.endDate = endDate;
	}
	processEventId() {
		this.eventId = this.getKey();
	}
	getKey() {
		return (
			this.startDate.getFullYear() +
			'-' +
			this.eventName.toLowerCase().replace(/[\.\#\$\[\]\s]/g, '')
		);
	}
	toJSON() {
		return {
			eventId: this.eventId,
			eventName: this.eventName,
			singleDay: this.singleDay,
			startDate: this.startDate.toLocaleDateString('en-US'),
			endDate: this.endDate.toLocaleDateString('en-US'),
			hotelAddress: this.hotelAddress,
			hotelUrl: this.hotelUrl,
			eventUrl: this.eventUrl,
			contactName: this.contactName,
			contactNumber: this.contactNumber,
			contactEmail: this.contactEmail,
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
