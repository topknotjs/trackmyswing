//Add error logging
class Event{
    constructor(data){
        if(!data) return;
        //console.log(data);
        this.SingleDay = false;
        this.StartDate = null;
        this.EndDate = null;
        this.HotelAddress = null;
        this.HotelUrl = null;
        this.ContactName = null;
        this.ContactNumber = null;
        this.ContactEmail = null;
        this.ProcessContact(data.contact);
        this.ProcessName(data.event_name);
        this.ProcessDate(data.date);
        this.ProcessLocation(data.location);
        this.ProcessContact(data.contact);
    } 
    ProcessContact(text){
        let matched = false;
        text.replace(/^([^0-9\+]*)(.*)<a.*>(.*)<\//, (match, $1, $2, $3, offset, original) => {
            matched = true;
            this.ContactName = Event.SanitizeData($1);
            this.ContactNumber = Event.SanitizeData($2.trim());
            this.ContactEmail = Event.SanitizeData($3.trim());
        });
        if(!matched){
            //console.log("Unmatched: ", text);
        }
    }
    ProcessLocation(text){
        text.replace(/^(.*)<a/, (match, $1, offset, original) => {
            this.HotelAddress = Event.SanitizeData($1);
        });
        text.replace(/^.*href=\'(.*)\'/, (match, $1, $offset, original) => {
            this.HotelUrl = Event.SanitizeData($1);
        });
    }
    ProcessName(text){
        this.EventName = text.replace(/\s\s+/g, " ").trim();
    }
    ProcessDate(text){
        let regexMatch = null, startDate = null, endDate = null;
        text.replace(/([A-Za-z]+) ([0-9]+)(, [0-9]+)? - ([A-Za-z]+)?\s?([0-9]+), ([0-9]{4})/, (match, $1, $2, $3, $4, $5, $6, offset, original) => {
            if($3 !== undefined && $3.includes(",")){
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
        });
        if(regexMatch === null){
            text.replace(/([A-Za-z]+) ([0-9]+), ([0-9]{4})/, (match, $1, $2, $3, offset, original) => {
                startDate = endDate = new Date(`${1} ${2}, ${3}`);
                this.SingleDay = true;
            });
        }
        this.StartDate = startDate.toLocaleDateString("en-US");
        this.EndDate = endDate.toLocaleDateString("en-US");
    }
    GetKey(){
        return this.StartDate.replace(/\//g, "-") + "-" + this.EventName.toLowerCase().replace(/[^a-z]/g, "");
    }
    static SanitizeRaw(text){
        return text.replace(/<br>/g, "").replace(/\n/g, "");
    }
    static SanitizeData(text){
        return text.replace(/\s\s+/g, " ").trim();
    }
}
module.exports = Event;