import axios from 'axios';

export default class API{
    call(url, method, data = null){
        let config = {method, url};
        if(data !== null){
            config.data = data;
            config.headers = {
                'Content-Type': 'application/json'
            };
        }
        return axios(config);
    }
    GetDancers(division, role){
        return new Promise((resolve, reject) => {
            this.call(`/api/dancers/${division}/${role}`, 'GET')
            .then((result) => {
                resolve(result.data);
            })
            .catch((error) => {
                reject(error);  
            });
        });
    }
    CreateAccount(accountData){
        return new Promise((resolve, reject) => {
            this.call(`/api/account/`, 'PUT', accountData)
            .then((result) => {
                resolve(result.data);
            })
            .catch((error) => {
                reject(error);  
            });
        });
    }
}