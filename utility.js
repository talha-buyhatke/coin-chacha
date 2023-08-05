const https = require('https');
const fs = require('fs');
const path = require('path');
const dbHandle = require('./db.js');
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

const crypto = require('crypto');

async function getMac(message) {
    try {
        const secretKey = 'lkjlh419#JLK@KLSA';
        const hmac = crypto.createHmac('sha512', secretKey);
        hmac.update(message);
        const mac = hmac.digest('hex');
        return mac;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
async function sendAllData(full_data, ex_name) {
    try {
        let newRes = [];
        let final_payload = JSON.parse(full_data)

        for (let i = 0; i < final_payload.length; i++) {
            if (i % 300 == 0) {

                console.log("sending:", newRes.length);
                const resJSON = JSON.stringify(newRes);
                console.log("--------------------------------------------------");
                if (i != 0)
                    await sendDataTurboExternal(resJSON, ex_name);
                newRes = []
            }
            newRes.push(final_payload[i]);
        }
        console.log("sending:", newRes.length);
        const resJSON = JSON.stringify(newRes);
        console.log("--------------------------------------------------");
        await sendDataTurboExternal(resJSON, ex_name);
    }
    catch (e) {
        console.log(e);
    }
}
async function sendDataTurboExternal(full_data, ex_name) {
    try {
        if (full_data.length == 0)
            return;
        let currentEpoch = Date.now().toString();
        let mac = await getMac("9h2f348f-293h49" + currentEpoch);
        if (JSON.parse(full_data).length > 0) {
            return new Promise(function (resolve, reject) {
                var data = full_data;
                data = "data=" + (data) + "&ex_name=" + ex_name;
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                myHeaders.append("mac", mac);
                myHeaders.append("epochTime", currentEpoch);
                var urlencoded = new URLSearchParams();
                urlencoded.append("data", full_data);
                urlencoded.append("ex_name", ex_name);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };
                fetch("http://localhost:3000/uploadTickerData", requestOptions)
                    .then(response => {
                        return resolve('ok');
                    })
                    .catch(error => {
                        console.log('error from new api: ', error);
                        return resolve('ok');
                    });
            });
        } else {
            return;
        }
    } catch (ee) {
        console.log("Error in sendDataTurboExternal ", ee);
    }
}
async function sendP2P(average, exchange_name) {
    try {
        if (average == null || exchange_name == null) {
            console.log('Invalid data');
            return;
        }
        try {
            let tQ_sel = 'SELECT id FROM `coin_chacha`.`p2p_table` WHERE ex_name=?';
            let res_sel = await dbHandle.commonQuery(tQ_sel, [exchange_name]);
            if (res_sel.length > 0) {
                var tQ_ju = `UPDATE coin_chacha.p2p_table SET average=? WHERE ex_name=?`;
                var val_ju = [average, exchange_name];
                await dbHandle.commonQuery(tQ_ju, val_ju);
            } else {
                var tQ_in = "INSERT INTO coin_chacha.p2p_table (ex_name,average) VALUES (?,?)"
                var val_in = [exchange_name, average];
                let res_in = await dbHandle.commonQuery(tQ_in, val_in);
            }
        } catch (ee) {
            console.log("Error in testDB ", ee);
        }

    }
    catch (e) {
        console.log(e);
    }
}
module.exports = {
    getDateTime,
    asyncForEach,
    parseAccNumber,
    sendDataToChat,
    delete_file,
    moveFileToError,
    makeTransDumpFiles,
    readFile,
    generateRandomString,
    sendDataTurboExternal,
    sendAllData,
    sendP2P
};