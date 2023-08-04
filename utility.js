const dbHandle = require('./db.js');
const https = require('https');
const fs = require('fs');
const path = require('path');
function getDateTime(utc = false) {
    var date = new Date();
    if (utc)
        date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    else
        date = new Date(date.getTime());

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

async function asyncForEach(array, callback) {
    for (var ele in array) {
        await callback(ele, array[ele]);
    }
}

async function getFiatDetails() {
    try {
        let fiats = {};
        var sq_fiat = "SELECT *FROM `onramp`.`fiat_details` WHERE 1";
        var res_fiat = await dbHandle.commonQuery(sq_fiat);
        await asyncForEach(res_fiat, async (ind, row_fiat) => {
            let fiat_type = row_fiat.fiat.toUpperCase();
            fiats[fiat_type] = {
                id: row_fiat.id,
                factor: row_fiat.factor,
            }
        });
        return fiats;
    } catch (ee) {
        console.log("Error in getFiatDetails ", ee);
        return {};
    }
}

const parseAccNumber = function (str) {
    let account_number = "";
    for (let i = 0; i < str.length - 1; i++) {
        if (str.substring(i, i + 2) === "TK") {
            // iterate until you find a number
            while (i < str.length && (str[i] < '0' || str[i] > '9')) i++;
            // now we find a number
            while (i < str.length && (str[i] >= '0' && str[i] <= '9' || str[i].toLowerCase() == 'x')) {
                account_number += str[i];
                i++;
            }
            break;
        }
    }

    return account_number;
};

async function sendDataToChat(dataToSend, webhookURL) {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.stringify({
                text: dataToSend,
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const req = https.request(webhookURL, options, (res) => {
                // Handle the response if needed
                // For example, you can log the response status code
                console.log('Response status code:', res.statusCode);

                // Resolve the promise once the request is complete
                return resolve('ok');
            });

            req.on('error', (error) => {
                console.error('Error in webhook Google Chat:', error);
                return reject(error);
            });

            req.write(data);
            req.end();
        } catch (error) {
            console.error('Error in webhook Google Chat:', error);
            return reject(error);
        }
    });
};


const delete_file = async function (absoluteFilePath) {
    try {
        await fs.promises.unlink(absoluteFilePath);
        console.log('File deleted successfully. ', absoluteFilePath);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
};

// Function to move a file
const moveFileToError = async (filePath) => {
    try {
        const destinationFilePath = path.resolve('./../trans_error_files/' + filePath);
        await fs.promises.rename('./../transactionDumpNew/' + filePath, destinationFilePath);
        console.log('File moved successfully. ', './../transactionDumpNew/' + filePath, './../trans_error_files/' + filePath);
    } catch (err) {
        console.error('Error moving file:', err);
    }
};

async function createJSONFile(foldername, filename, data) {
    try {
        const filepath = path.join(foldername, filename);
        fs.writeFileSync(filepath, JSON.stringify(data));
        // console.log('file_data', data);
        // console.log(`JSON file '${filename}' created in the existing folder '${foldername}'.`);
    } catch (ee) {
        console.log("Error in createJSONFile ", ee);
    }
};

const makeTransDumpFiles = async (allData) => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
    const fileName = `${timestamp}_${randomNumber}.json`;
    const foldername = './transactionDumpNew';
    await createJSONFile(foldername, fileName, allData);
}

function generateRandomString() {
    let randomString = '';
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);
    randomString = timestamp + '_' + randomNumber;
    const index = Math.floor(Math.random() * (randomString.length - 1)) + 1;
    randomString = randomString.slice(0, index) + '_' + randomString.slice(index);

    return randomString;
}

async function readFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', async (err, data) => {
            if (err) {
                console.log('Error reading JSON file:', err);
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
}
module.exports = {
    getDateTime,
    asyncForEach,
    getFiatDetails,
    parseAccNumber,
    sendDataToChat,
    delete_file,
    moveFileToError,
    makeTransDumpFiles,
    readFile,
    generateRandomString
};