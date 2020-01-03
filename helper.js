const request = require('request');
const helperServ = require('./HelperService');
const envData = require('./constants').envData;


module.exports = {
    getMasterData: function() {
        console.log('Server started');
        helperServ.helperService().getMasterData();
    },

    checkHealth: function() {
        console.log('Checking Health at: ',new Date().toUTCString());
        helperServ.helperService().checkHealth();
    },

    getCoachOfficeData: function() {
        console.log('getCoachOfficeData: ',new Date().toUTCString());
        helperServ.helperService().getCoachOfficeData();
    },

    removeFiles: function() {
        helperServ.helperService().removeFiles();
     },

     getFileData: function(fileName) {
        console.log('getFileData:',new Date().toUTCString());
        return helperServ.helperService().getFileData(fileName);
    },

    writeTofile: function(res) {
        console.log('getFileData:',new Date().toUTCString());
        return helperServ.helperService().writeToFile(res, envData.pathToStoreExcelJson, 'madhu');
    }
}