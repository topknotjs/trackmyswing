const memcache = require('memory-cache');

let cache = (duration) => {
    return (req, res, next) =>{
        let key = '__express__' + req.originalUrl || req.url;
        
        let cachedBody = memcache.get(key);
        if(cachedBody){
            console.log("found key: ", key);
            res.send(cachedBody);
        }else{
            console.log("new key: ", key);
            res.sendResponse = res.send;
            res.send = (body) => {
                memcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

module.exports = cache;