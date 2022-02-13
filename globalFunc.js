const fs = require('fs');
const globals = require("./globals.json");
require('dotenv').config();
const axios = require('axios');




module.exports = {
    logErrors: (Error) => {
        try {            
            console.log(Error);
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
        catch (Error) {
            console.log(Error);
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
    },
    
    logMissedKeys: (MissedKey) => {
        try {
            var logStream = fs.createWriteStream('logKeys.txt', {flags: 'a'});
            var logmessage = "Cache miss => " + MissedKey;
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + logmessage);
            logStream.end();
            console.log(logmessage);
        }
        catch (Error) {
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
    },
    
    logHitKeys: (MissedKey) => {
        try {
            var logStream = fs.createWriteStream('logKeys.txt', {flags: 'a'});
            var logmessage = "Cache hit => " + MissedKey;
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + logmessage);
            logStream.end();
            console.log(logmessage);
        }
        catch (Error) {
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
    },
    
    getRandomText: () => {
        var text = ("Lorem ipsum dolor sit amet consectetur adipisicing elit Accusantium aliquam ipsa aspernatur qui dolorum odio inventore a expedita repudiandae laboriosam iusto culpa id unde iure ducimus nihil reprehenderit consequuntur Laboriosam").split(" ");
        var randomString = text[Math.floor(Math.random() * 30)] + " " + text[Math.floor(Math.random() * 30)] + " " + text[Math.floor(Math.random() * 30)] + " " + text[Math.floor(Math.random() * 30)] + " " + text[Math.floor(Math.random() * 30)];
        return randomString;
    },
    
    validateDataLimit: async () => {
        try {
            var totalData = await globals._dbs.collection(process.env.dbsCacheDataCollection).find({}).sort({_id: -1}).count();
            if (totalData > parseInt(process.env.cacheDataLimit)) {
                var allData = await globals._dbs.collection(process.env.dbsCacheDataCollection).find({}).sort({_id: 1}).limit(totalData - parseInt(process.env.cacheDataLimit)).toArray();
                var deleteDataIds = [];
                allData.forEach(dataGroup => {
                    deleteDataIds.push(dataGroup._id);
                });
                globals._dbs.collection(process.env.dbsCacheDataCollection).deleteMany({_id: { $in: deleteDataIds }}, function (err, dltResult) {
                    if (err) console.log("err", err);
                });
            }
        }
        catch (Error) {
            this.logErrors(Error);
        }
    }

}