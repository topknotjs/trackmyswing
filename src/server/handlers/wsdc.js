let axios = require('axios');
let CircularJson = require('circular-json');
class WSDC{
    constructor(){
        this.DancersUrl = "http://swingdancecouncil.herokuapp.com/pages/dancer_search_by_fragment.json?term=";
        this.DancerUrl = "https://points.worldsdc.com/lookup/find";
        this.EventsUrl = "https://www.worldsdc.com/wp-admin/admin-ajax.php";
    }
    GetDancers(){
        let dPromise = new Promise((resolve, reject) => {
            axios.get(this.DancersUrl)
                .then((results) => {
                    resolve(results.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return dPromise;
    }
    GetDancer(wscid){
        return new Promise((resolve, reject) => {
            axios.post(this.DancerUrl, {q: wscid})
                .then((dancerResult) => {
                    let serialized = CircularJson.stringify(dancerResult.data);
                    let parsed = CircularJson.parse(serialized);
                    resolve(parsed);                    
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    GetEvents(){
        return new Promise((resolve, reject) => {
            console.log("Url: ", this.EventsUrl);
            axios.post(this.EventsUrl, {date_range: 12, action: "fetch_searched_event"})
                .then((eventsResult) => {
                    let serialized = CircularJson.stringify(eventsResult.data);
                    let parsed = CircularJson.parse(serialized);
                    resolve(parsed)
                })
                .catch((error) => {
                    console.log("Get events error: ", error);
                    reject(error);
                });
        });

    }
}

module.exports = function(){
    return new WSDC();
};

