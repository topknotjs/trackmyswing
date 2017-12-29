let axios = require('axios');
let https = require('https');
let CircularJson = require('circular-json');
const querystring = require('querystring');
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
            let postData = querystring.stringify({date_range: 12, action: "fetch_searched_event"});
            const options = {
                hostname: "www.worldsdc.com",
                port: 443,
                path: "/wp-admin/admin-ajax.php",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": postData.length
                },
                method: "POST"
            }
            let req = https.request(options, (res) => {
                console.log("statuscode: ", res.statusCode);
                let data = "";
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    console.log(CircularJson.parse(data));
                });
            });
            req.on('error', (e) => {
                console.log("error: ", e);
            });
            req.write(postData);
            req.end();
            

            
            /*axios.post(this.EventsUrl, {data: JSON.stringify({date_range: 12, action: "fetch_searched_event"})})
                .then((eventsResult) => {
                    let serialized = CircularJson.stringify(eventsResult.data);
                    let parsed = CircularJson.parse(serialized);
                    resolve(parsed)
                })
                .catch((error) => {
                    console.log("Get events error: ", error);
                    reject(error);
                });*/
        });

    }
}

module.exports = function(){
    return new WSDC();
};

