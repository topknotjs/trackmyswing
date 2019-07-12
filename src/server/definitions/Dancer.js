const LoggerService = require('../handlers/logger');
const Placement = require('./Placement');
const logger = new LoggerService();
const PLACEMENTS_KEY = 'West Coast Swing';
const DEFAULT_RELEVENCE = 5;
const DIVISION_MAP = {
  Champions: {
    Key: 'champion',
    MaxPoints: null,
    PreviousDivision: 'All-Stars',
  },
  'All-Stars': {
    Key: 'allstar',
    MaxPoints: null,
    PreviousDivision: 'Advanced',
  },
  Advanced: {
    Key: 'advanced',
    MaxPoints: 45,
    PreviousDivision: 'Intermediate',
  },
  Intermediate: {
    Key: 'intermediate',
    MaxPoints: 30,
    PreviousDivision: 'Novice',
  },
  Novice: { Key: 'novice', MaxPoints: 15, PreviousDivision: 'Newcomer' },
  Newcomer: { Key: 'newcomer', MaxPoints: 1, PreviousDivision: null },
};

const getDivisionName = division => {
  if (!division.name || !DIVISION_MAP.hasOwnProperty(division.name)) {
    return null;
  }
  return DIVISION_MAP[division.name].Key;
};

class Dancer {
  constructor(config) {
    if (!config) return;
    this.firstName = config.firstName;
    this.lastName = config.lastName;
    // TODO: Remove this! Make sure that we are getting the correct value
    this.wsdcId = config.wsdcid;
    this.currentPoints = config.currentPoints;
    this.division = config.division;
    this.record = {};
    this.role = config.role;
    this.relevance =
      config.relevance === undefined ? DEFAULT_RELEVENCE : config.relevance;
    this.qualifiesForNextDivision = config.qualifiesForNextDivision;
    this.divisionRoleQualifies = config.divisionRoleQualifies;
    this.processFBRecord(config.record);
  }
  LoadWSDC(config) {
    if (!config) return;
    let dancer = config.dancer;
    // Load up dancer basic info
    // TODO: Validate this info!
    this.firstName = dancer.first_name;
    this.lastName = dancer.last_name;
    // The WSDC api sends back the wsdcid as 'wsdcid'. We correct this.
    this.wsdcId = dancer.wscid;
    this.currentPoints = 0;
    this.division = null;
    this.role = null;
    this.relevance = DEFAULT_RELEVENCE;
    this.qualifiesForNextDivision = false;
    this.divisionRoleQualifies = null;
    this.Error = false;
    if (config.placements.hasOwnProperty(PLACEMENTS_KEY)) {
      this.processWsdcDivisions(config.placements[PLACEMENTS_KEY]);
    } else {
      this.Error = 'No west coast swing points.';
      logger.log(`Dancer ${this.wsdcId} error => ${this.Error}`);
    }
  }
  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      wsdcid: this.wsdcId,
      currentPoints: this.currentPoints,
      division: this.division,
      role: this.role,
      relevance: this.relevance,
      qualifiesForNextDivision: this.qualifiesForNextDivision,
      divisionRoleQualifies: this.divisionRoleQualifies,
      record: Object.keys(this.record).reduce((acc, key) => {
        acc[key] = this.record[key].reduce((acc, placement) => {
          acc.push(placement.toJSON());
          return acc;
        }, []);
        return acc;
      }, {}),
    };
  }
  processFBRecord(record) {
    const recordList = {};
    for (let key in record) {
      recordList[key] = record[key].reduce((acc, pl) => {
        acc.push(new Placement(pl));
        return acc;
      }, []);
    }
    this.record = recordList;
  }
  processWsdcDivisions(danceTypePlacements) {
    // Sanity check the data
    if (!danceTypePlacements) return;
    this.getCurrentDancerData(danceTypePlacements);
    this.getDivisionData(danceTypePlacements);
  }
  getDivisionData(danceTypePlacements) {
    const divisions = {};
    for (let key in danceTypePlacements) {
      if (!danceTypePlacements.hasOwnProperty(key)) {
        continue;
      }
      if (!danceTypePlacements[key].hasOwnProperty('division')) {
        continue;
      }

      const divisionName = getDivisionName(
        danceTypePlacements[key]['division']
      );
      const placements = danceTypePlacements[key]['competitions'];
      divisions[divisionName] = [];
      for (let i = 0, len = placements.length; i < len; i++) {
        let pl = new Placement();
        pl.processWSDC(placements[i]);
        divisions[divisionName].push(pl);
      }
    }
    this.record = divisions;
  }
  getCurrentDancerData(danceTypePlacements) {
    let placements = Object.values(danceTypePlacements);
    if (!Array.isArray(placements) || !placements.length) {
      return;
    }
    let currentIndex = 0;
    let yearCoefficient = 1000 * 60 * 60 * 24 * 360;
    let divisionConfig = placements[currentIndex];

    // Attempt to find pointed JJ division
    while (currentIndex < placements.length) {
      let currentPlacement = placements[currentIndex++];
      if (DIVISION_MAP.hasOwnProperty(currentPlacement.division.name)) {
        divisionConfig = currentPlacement;
        break;
      }
    }

    // Determine Relevance by how many years ago the last event placement was
    if (
      divisionConfig.competitions.length > 0 &&
      divisionConfig.competitions[0].event != null
    ) {
      let recentDateStr = divisionConfig.competitions[0].event.date;
      let parts = recentDateStr.split(' ');
      let compDate = new Date(`${parts[0]} 1, ${parts[1]}`);
      let currentDate = new Date();
      let years = Math.floor((currentDate - compDate) / yearCoefficient);
      if (years < DEFAULT_RELEVENCE) {
        this.relevance = years;
      }
    }

    // Determine Division, Role, Qualifies
    // TODO: Fix qualifiesfornextdivision
    if (DIVISION_MAP.hasOwnProperty(divisionConfig.division.name)) {
      let identifiedDivision = DIVISION_MAP[divisionConfig.division.name];
      this.division = identifiedDivision.Key;
      this.qualifiesForNextDivision =
        identifiedDivision.MaxPoints === null
          ? false
          : identifiedDivision.MaxPoints <= divisionConfig.total_points;
    } else {
      this.division = divisionConfig.division.name
        .replace(/[^a-zA-Z]/, '')
        .toLowerCase();
      this.qualifiesForNextDivision = false;
    }

    this.role =
      divisionConfig.competitions.length == 0
        ? 'N/A'
        : divisionConfig.competitions[0].role;
    this.currentPoints = divisionConfig.total_points;
    this.divisionRoleQualifies = `${this.division}-${this.role}${
      this.qualifiesForNextDivision ? '-q' : ''
    }`;
  }
  static SanitizeDivision(divisionInput) {
    let sanitized = divisionInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z]*/, '');
    let result = null;
    for (let key in DIVISION_MAP) {
      let mapItem = DIVISION_MAP[key];
      if (mapItem.Key == sanitized) {
        result = mapItem.Key;
        break;
      }
    }
    return result;
  }
  static SanitizeRole(roleInput) {
    let sanitized = roleInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z]*/, '');
    if (sanitized === 'leader' || sanitized === 'follower') {
      return sanitized;
    }
    return null;
  }
  static SanitizeWsdcid(wsdcidInput) {
    if (typeof wsdcidInput === 'number') {
      return wsdcidInput;
    }
    let sanitized = wsdcidInput
      .trim()
      .toLowerCase()
      .replace(/[^0-9]*/, '');

    if (parseInt(sanitized) < 0) {
      return null;
    }
    return parseInt(sanitized);
  }

  static GetPreviousDivision(division) {
    let divisionValues = Object.values(DIVISION_MAP);
    for (let i = 0, len = divisionValues.length; i < len; i++) {
      if (divisionValues[i].Key === division) {
        return divisionValues[i].PreviousDivision;
      }
    }
    return null;
  }
  static IsPreviousDivisionAvailable(division) {
    let divisionValues = Object.values(DIVISION_MAP);
    for (let i = 0, len = divisionValues.length; i < len; i++) {
      if (divisionValues[i].Key === division) {
        return divisionValues[i].PreviousDivision !== null;
      }
    }
    return false;
  }
}
module.exports = Dancer;
