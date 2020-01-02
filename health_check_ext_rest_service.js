var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cron = require("node-cron");
const help = require('./helper');
const envData = require('./constants').envData;

// cron job for every hour 28 min
cron.schedule(envData.cron1, () => {
   help.checkHealth();
   help.getCoachOfficeData();
});

// cron job for every hour 58 min
cron.schedule(envData.cron2, () => {
   help.checkHealth();
   help.getCoachOfficeData();
});

// check health service
app.get('/health', (req, res) => {
   help.checkHealth();
   res.send('Checking External Rest Service Health...!');
});

// check health service
app.get('/coach-office', (req, res) => {
   help.getCoachOfficeData();
   res.send('Getiing the coach office service data for dashborad...!');
});

app.get('/', (req, res) => {
   res.send('Welcome to External Rest Service Health Check.');
});



app.listen(1111, help.getMasterData());
