import axios from 'axios';

export default class API{
    call(url, method, data = null){
        let config = {method, url};
        if(data !== null){
            config.data = data;
        }
        return axios(config);
    }
    GetDancers(division, role){
        let dancersPromise = new Promise((resolve, reject) => {
            this.call(`/api/dancers/${division}/${role}`, 'GET')
            .then((result) => {
                resolve(result.data);
            })
            .catch((error) => {
                reject(error);  
            });
        });
        return dancersPromise;
    }
}