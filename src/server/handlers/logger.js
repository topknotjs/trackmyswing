/**
 * Logger handler for trackmyswing
 * TODO: Make it so this logger can write to multiple files and archive old logs
 */
let fs = require('fs');
let path = require('path');
const loggerDirectory = __dirname  + "/../../../logs/";
const logFile = `${loggerDirectory}trackmyswing.log`;
let Logger = function(){
    let record = (text) => {
        if(!fs.existsSync(logFile)){
            if(!fs.existsSync(loggerDirectory)){
                fs.mkdirSync(loggerDirectory);
            }
            
            fs.writeFile(
                logFile, 
                text + '\n',
                error => {
                    if(error){
                        console.log("Unable to write to log file: ", error);
                    }                    
                });
        }else{
            console.log("Appending to file: ", logFile);
            fs.appendFile(
                logFile, 
                text + '\n',
                error => {
                    if(error){
                        console.log("Unable to write to log file: ", error);
                    }
                });
        }        
    };
    this.log = function(message){
        console.log("Writing to: ", logFile);
        record(message);
    };
    this.info = function(message){
        console.log("Writing to: ", logFile);
        record(message);     
    };
    this.error = function(message){
        console.log("Writing to: ", logFile);
        record(message);   
    };
};
module.exports = Logger;