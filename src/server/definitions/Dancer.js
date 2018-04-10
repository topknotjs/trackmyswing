const PLACEMENTS_KEY = 'West Coast Swing';
const DEFAULT_RELEVENCE = 5;
const DIVISION_MAP = {
    'Champions': {Key: 'champion', MaxPoints: null},
    'All-Stars': {Key: 'allstar', MaxPoints: null},
    'Advanced': {Key: 'advanced', MaxPoints: 45},
    'Intermediate': {Key: 'intermediate', MaxPoints: 30},
    'Novice': {Key: 'novice', MaxPoints: 15},
    'Newcomer': {Key: 'newcomer', MaxPoints: 1}    
}
class Dancer{
    constructor(config){
        if(!config) return;
        this.FirstName = config.FirstName;
        this.LastName = config.LastName;
        this.WSCID = config.WSCID;
        this.CurrentPoints = config.CurrentPoints;
        this.Division = config.Division;
        this.Role = config.Role;
        this.Relevance = config.Relevance === undefined ? DEFAULT_RELEVENCE : config.Relevance;
        this.QualifiesForNextDivision = config.QualifiesForNextDivision;
        this.DivisionRoleQualifies = `${this.Division}-${this.Role}${this.QualifiesForNextDivision ? '-q' : ''}`;
    }
    LoadWSDC(config){
        if(!config) return;
        let dancer = config.dancer;
        //Load up dancer basic info
        //TODO: Validate this info!
        this.FirstName = dancer.first_name;
        this.LastName = dancer.last_name;
        this.WSCID = dancer.wscid;
        this.CurrentPoints = 0;
        this.Division = null;
        this.Role = null;
        this.Relevance = DEFAULT_RELEVENCE;
        this.QualifiesForNextDivision = false;
        this.DivisionRoleQualifies = null;
        this.GetDivision(config.placements[PLACEMENTS_KEY]);
    }
    GetDivision(placements){
        if(!Array.isArray(placements) || !placements.length) return;
        let currentIndex = 0;
        let yearCoefficient = 1000 * 60 * 60 * 24 * 360;
        let divisionConfig = placements[currentIndex];
        //Attempt to find pointed JJ division
        while(currentIndex < placements.length){
            let currentPlacement = placements[currentIndex++];
            if(DIVISION_MAP.hasOwnProperty(currentPlacement.division.name)){
                divisionConfig = currentPlacement;                
                break;
            }
        }
        //Determine Relevance by how many years ago the last event placement was
        if(divisionConfig.competitions.length > 0 && divisionConfig.competitions[0].event != null){
            let recentDateStr = divisionConfig.competitions[0].event.date;
            let parts = recentDateStr.split(" ");
            let compDate = new Date(`${parts[0]} 1, ${parts[1]}`);
            let currentDate = new Date();
            let years = Math.floor((currentDate - compDate) / yearCoefficient);
            if(years < DEFAULT_RELEVENCE){
                this.Relevance = years;
            }
        }
        //Determine Division, Role, Qualifies
        if(DIVISION_MAP.hasOwnProperty(divisionConfig.division.name)){
            let identifiedDivision = DIVISION_MAP[divisionConfig.division.name];
            this.Division = identifiedDivision.Key;
            this.QualifiesForNextDivision = (identifiedDivision.MaxPoints === null) ? false : identifiedDivision.MaxPoints <= divisionConfig.total_points;
        }else{
            this.Division = divisionConfig.division.name.replace(/[^a-zA-Z]/, '').toLowerCase();
            this.QualifiesForNextDivision = false;
        }

        this.Role = (divisionConfig.competitions.length == 0) ? 'N/A' : divisionConfig.competitions[0].role;
        this.CurrentPoints = divisionConfig.total_points;
        this.DivisionRoleQualifies = `${this.Division}-${this.Role}${this.QualifiesForNextDivision ? '-q' : ''}`;
    }
    static SanitizeDivision(divisionInput){
        let sanitized = divisionInput.trim().toLowerCase().replace(/[^a-z]*/, '');
        let result = null;
        for(let key in DIVISION_MAP){
            let mapItem = DIVISION_MAP[key];
            if(mapItem.Key == sanitized){
                result = mapItem.Key;
                break;
            }
        }
        return result;
    }
    static SanitizeRole(roleInput){
        let sanitized = roleInput.trim().toLowerCase().replace(/[^a-z]*/, '');
        if(sanitized === 'leader' || sanitized === 'follower'){
            return sanitized;
        }
        return null;
    }
    static SanitizeWscid(wscidInput){
        if(typeof wscidInput === 'number'){
            return wscidInput;
        }
        let sanitized = wscidInput.trim().toLowerCase().replace(/[^0-9]*/, '');
        
        if(parseInt(wscidInput) < 0){
            return null;
        }
        return parseInt(wscidInput);
    }
}
module.exports = Dancer;