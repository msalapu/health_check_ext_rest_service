const request = require('request');
const helperServ = require('./HelperService');


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
     }
}