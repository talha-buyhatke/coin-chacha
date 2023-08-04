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

let data = [{ ex_name: 'sample', coin_id: 'sample', price: '0' }];
let ex_name = 'sample';
sendDataTurboExternal(JSON.stringify(data), ex_name);