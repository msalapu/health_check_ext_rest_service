
const envData = require('./constants').envData;
const request = require('request');
var fs = require('fs');
const path = require('path');

class HelperService {
    constructor(envData) {
        this.envData = envData;
    }

    async getMasterData() {
        for (let i = 1; i <= 2; i++) {
            let url = '';
            let fileName = '';
            if (i === 1) {
                url = this.envData.qa;
                fileName = this.envData.qaFileName;
            } else {
                url = this.envData.uat;
                fileName = this.envData.uatFileName;
            }
            await make_API_call(url).then(response => {
                if (response) {
                    console.log('Got', fileName);
                    this.writeToFile(response, envData.masterDataPath, fileName);
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }

    checkHealth() {
        let fileToProcess = '';
        const qaFileToProcess = `${envData.masterDataPath}/${envData.qaFileName}.json`;
        const uatFileToProcess = `${envData.masterDataPath}/${envData.uatFileName}.json`;
        for (let j = 1; j <= 2; j++) {
            fileToProcess = (j === 1) ? qaFileToProcess : uatFileToProcess;
            console.log('Processing', fileToProcess);
            fs.readFile(fileToProcess, (err, data) => {
                if (err) return console.log(err);
                let students = JSON.parse(data);
                for (const obj of students.items) {
                    make_API_call(obj.rest_service_url).then(response => {
                        if (response) {
                            this.writeToFile(response, obj.rest_service_filepath, obj.rest_service_filename);
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }
            });
        }
    }

    async getCoachOfficeData() {
        for (const obj of this.envData.coach_office) {
            await make_API_call(obj.url).then(response => {
                if (response) {
                    this.writeToFile(response, obj.path, obj.filename);
                }
            }).catch(error => {
                console.log(error)
            })
        }

    }

    removeFiles() {
        const directory = __dirname+'/uploads/';
        console.log('directory',directory);
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    }

    getFileData(fileName) {
        let fileToProcess = '';
        switch (fileName) {
            case 'excelFile': fileToProcess = 'C:/home/madhu.json';
                break;
            case 'qa1': fileToProcess = `C:/home/oracle/composite-monitor/atgcom_1_11000.json`;
                break;
            default: fileToProcess = `${envData.masterDataPath}/${envData.qaFileName}.json`;
        }
        console.log('Processing', fileToProcess);
        return fs.readFileSync(fileToProcess);
    }

    writeToFile(res, location, filename) {
        let data = JSON.stringify(res, null, 2);
        const filepath = `${location}/${filename}.json`;
        fs.writeFile(filepath, data, (err) => {
            if (err) return console.log(err);
            console.log('Data written to file: ', filepath);
        });
    }

}


async function make_API_call(url) {
    return await new Promise((resolve, reject) => {
        request(url, { json: true }, (err, res, body) => {
            if (err) reject(err)
            resolve(body)
        });
    })
}

// function writeToFile(res, location, filename) {
//     let data = JSON.stringify(res, null, 2);
//     const filepath = `${location}/${filename}.json`;
//     fs.writeFile(filepath, data, (err) => {
//         if (err) return console.log(err);
//         console.log('Data written to file: ', filepath);
//     });
// }

module.exports = {
    helperService: function () {
        return new HelperService(envData);
    }
};
