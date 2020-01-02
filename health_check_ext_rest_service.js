var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cron = require("node-cron");
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

const help = require('./helper');
const envData = require('./constants').envData;

app.use(bodyParser.json());
app.use(function (req, res, next) {
   //set headers to allow cross origin request.
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
app.use(bodyParser.urlencoded({ extended: true }));


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

var storage = multer.diskStorage({ //multers disk storage settings
   destination: function (req, file, cb) {
       cb(null, './uploads/')
   },
   filename: function (req, file, cb) {
       var datetimestamp = Date.now();
       cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
   }
});

var upload = multer({ //multer settings
   storage: storage,
   fileFilter: function (req, file, callback) { //file filter
       if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
           return callback(new Error('Wrong extension type'));
       }
       callback(null, true);
   }
}).single('file');

/** API path that will upload the files */
app.post('/upload', (req, res) => {
   console.log('got hit')
   var exceltojson;
   upload(req, res, (err) => {
       if (err) {
           res.json({ error_code: 1, err_desc: err });
           return;
       }
       /** Multer gives us file info in req.file object */
       if (!req.file) {
           res.json({ error_code: 1, err_desc: "No file passed" });
           return;
       }
       /** Check the extension of the incoming file and 
        *  use the appropriate module
        */
       const fileExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
       if (fileExt === 'xlsx') {
           exceltojson = xlsxtojson;
       } else {
           exceltojson = xlstojson;
       }
       console.log('gottt')
       const originalFileName = req.file.originalname.substr(0,req.file.originalname.length - (fileExt.length+1));
       const outputFileName = `${envData.pathToStoreExcelJson}/${originalFileName}.json`;
       console.log('org name', outputFileName)
       try {
           exceltojson({
               input: req.file.path,
               output: `${outputFileName}`,
               lowerCaseHeaders: true
           }, function (err, result) {
               if (err) {
                   return res.json({ error_code: 1, err_desc: err, data: null });
               }
               help.removeFiles();
               res.json({ error_code: 0, err_desc: null, data: result });
           });
       } catch (e) {
           res.json({ error_code: 1, err_desc: "Corupted excel file" });
       }
   })

});

app.post('/cust-file', (req, res) => {
   // const id = uuidv4();
   // const message = {
   //   id,
   //   text: req.body.text,
   // };
   // messages[id] = message;
   // return res.send(message);
   console.log(req.body);
   res.json({ "good":"ok"});
 });

app.listen(1111, help.getMasterData());
