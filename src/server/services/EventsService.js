const fDB = require('../handlers/fireDB');
const Event = require('../definitions/Event');
const Logger = require('../handlers/logger');
const logger = new Logger();
class EventsService {
	constructor() {
		this.fireDB = new fDB();
	}
	async getAllEvents() {
		try {
			const events = await this.fireDB.getEvents();
			logger.info(`Found events ${events.length}`);
			return events;
		} catch (error) {
			throw new Error(error);
		}
	}
	async getEvent(id) {
		try {
			const event = await this.fireDB.getEvent(id);
			logger.info(`Found event ${event.event}`);
			return event;
		} catch (error) {
			throw new Error(error);
		}
	}
	async getCurrentYearEvents() {
		try {
			const currentYear = new Date().getFullYear().toString();
			const events = await this.fireDB.getEventsOrderedByYear(
				currentYear
			);
			const currentEvents = [];
			for (let key in events) {
				if (key.indexOf(currentYear) === 0) {
					let ev = new Event();
					ev.processFBData(events[key]);
					currentEvents.push(ev);
				}
			}
			return currentEvents.sort(
				(a, b) => b.StartDate.getTime() - a.StartDate.getTime()
			);
		} catch (error) {
			throw new Error(error);
		}
	}
}

module.exports = EventsService;
