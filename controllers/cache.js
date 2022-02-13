const globals = require("../globals.json");
const globalsFunction = require("../globalFunc");
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const req = require('express/lib/request');



module.exports = {
    
    getKeyData: async (req, res) => {
        try {
            var searchKey = (req.params.key)? {"key": req.params.key}: {};
            globals._dbs.collection(process.env.dbsCacheDataCollection).find(searchKey).toArray(async function (err, result) {
                if (err) throw err;
                if (result.length <= 0 && (req.params.key)) {
                    globalsFunction.logMissedKeys(req.params.key);
                    
                    var randomString = globalsFunction.getRandomText();

                    globals._dbs.collection(process.env.dbsCacheDataCollection).insertOne({"key": req.params.key, "value": randomString,"dateTime": new Date()}, function(err, insertResult) {  
                        if (err) throw err;  
                        if (insertResult.acknowledged) {
                            var _result = [{"key": req.params.key, "value": randomString,"dateTime": new Date()}];
                            res.status(200).json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: _result});
                            globalsFunction.validateDataLimit();
                            return false;
                        }
                        else {
                            globalsFunction.logErrors(JSON.stringify(insertResult));
                            res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                            globalsFunction.validateDataLimit();
                            return false;
                        }
                    }); 
                }
                else {
                    
                    var _result = [];

                    for (var i = 0; i < result.length; i++) {
                        globalsFunction.logHitKeys(result[i].key)
                        var difference = (new Date().getTime()) - (result[i].dateTime);
                        if (difference > parseInt(process.env.cacheDataTTL)) {
                            _result[i] = result[i];
                            _result[i].value = globalsFunction.getRandomText();
                            _result[i].dateTime = new Date();                        
                        }
                        else {
                            _result[i] = result[i];
                            _result[i].dateTime = new Date();                        
                        }
                    }


                    const updateResult = (searchObject, updtObject) => new Promise(async (resolve) => {
                        globals._dbs.collection(process.env.dbsCacheDataCollection).updateOne(searchObject, {$set: updtObject}, function(err, updtResult) {  
                            if (err) throw err;
                            if (updtResult.modifiedCount) {
                                resolve("success");
                            }
                            else {
                                resolve(updtObject);
                            }
                        });
                    });
                  
                    const loop = async () => {
                        let updatedResult = result.filter((item) => Object.keys(item).length);
                        while (updatedResult.length != 0) {
                            delete _result[updatedResult.length - 1]["_id"];
                            updtResult = await updateResult({"key": result[updatedResult.length - 1].key}, _result[updatedResult.length - 1])
                            if (updtResult == "success") {
                                delete result[updatedResult.length - 1];
                            }
                            else {
                                _result[updatedResult.length - 1] = result[updatedResult.length - 1]
                            }
                            updatedResult = result.filter((item) => Object.keys(item).length)
                        }
                    }
                    
                    loop().then(() => {
                        res.status(200).json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: _result});
                    })

                } 
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    setKeyData: async (req, res) => {
        try {
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                res.status(400).json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            }
            else {
                var dateTimeNow = new Date();
                globals._dbs.collection(process.env.dbsCacheDataCollection).findOneAndUpdate({"key": req.body.key}, {$set: {"key": req.body.key, "value": req.body.value,"dateTime": dateTimeNow}}, { upsert: true, returnNewDocument: true }, function(err, updtResult) {  
                    if (err) throw err;
                    // console.log(updtResult);
                    if (updtResult.value) {
                        res.status(200).json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: updtResult.value});
                    }
                    else if (updtResult.lastErrorObject.upserted) {
                        globalsFunction.validateDataLimit();
                        res.status(200).json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: {"key": req.body.key, "value": req.body.value,"dateTime": dateTimeNow}});
                    }
                    else {
                        globalsFunction.logErrors(JSON.stringify(updtResult));
                        res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData});
                    }
                });
            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    updtKeyData: async (req, res) => {
        try {
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                res.status(400).json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            }
            else {
                globals._dbs.collection(process.env.dbsCacheDataCollection).findOneAndUpdate({"key": req.body.key}, {$set: {"key": req.body.key, "value": req.body.value,"dateTime": new Date()}}, { returnNewDocument: true }, function(err, updtResult) {  
                    if (err) throw err;
                    if (updtResult.value) {
                        res.status(200).json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: updtResult.value});
                    }
                    else {
                        globalsFunction.logErrors(JSON.stringify(updtResult));
                        res.status(400).json({status: globals.responses.errorStatus, message: "Key Not Found!", data: globals.responses.commonBlankData});
                    }
                });
            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    removeKeyData: async (req, res) => {
        try {
            globals._dbs.collection(process.env.dbsCacheDataCollection).deleteOne({"key": req.params.key}, function(err, dltResult) {  
                if (err) throw err;
                if (dltResult.deletedCount) {
                    res.status(200).json({status: "Key data for '" + req.params.key  + "' is deleted successfully!", message: globals.responses.commonSuccessMessage, data: globals.responses.commonBlankData});
                }
                else {
                    globalsFunction.logErrors(JSON.stringify(dltResult));
                    res.status(400).json({status: globals.responses.errorStatus, message: "Key Not Found!", data: globals.responses.commonBlankData});
                }
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    removeAllKeyData: async (req, res) => {
        try {
            globals._dbs.collection(process.env.dbsCacheDataCollection).deleteMany({}, function(err, dltResult) {  
                if (err) throw err;
                if (dltResult.deletedCount) {
                    res.status(200).json({status: "All keys deleted successfully!", message: globals.responses.commonSuccessMessage, data: globals.responses.commonBlankData});
                }
                else {
                    globalsFunction.logErrors(JSON.stringify(dltResult));
                    res.status(400).json({status: globals.responses.errorStatus, message: "No Keys To Delete!", data: globals.responses.commonBlankData});
                }
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.status(500).json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    }

}