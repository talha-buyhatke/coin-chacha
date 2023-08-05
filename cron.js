const dbHandle = require('./db.js');
const fs = require('fs');
const utility = require('./utility.js');


async function start() {
    let dumpFiles = [];
    try {
        fs.readdirSync('./tickerDump/').forEach(async (file) => {
            dumpFiles.push(file);

        });

        await utility.asyncForEach(dumpFiles, async function (eachRow, file) {
            console.log("---- START  ----  ", file);
            await matchReadAndDelete(file);
            console.log("---- DONE  ----  ", file);
            fs.unlink("./tickerDump/" + file, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // console.log("---- DELETED  ----  ", file);
            });
        });
    }
    catch (e) {
        console.log(e);
    }
}
let flag = true;
async function matchReadAndDelete(file) {
    var ex_name = file.split("__")[0].trim();
    const fileContents = fs.readFileSync("./tickerDump/" + file, 'utf-8');
    // console.log({ fileContents });
    let data = [];
    try {
        data = JSON.parse(fileContents);
    } catch (ee) {
        console.log("issue pardsing ", ee);
        return;
    }
    await utility.asyncForEach(data, async function (index, eachData) {
        if (flag) {
            console.log(eachData);
            flag = false;
        }
        let price = eachData['price'];
        let ex_name = eachData['ex_name'];
        let coin_id = eachData['coin_id']
        try {
            if (price != null && ex_name != null && coin_id != null && price != 'undefined') {
                await insertDBRecon(price, ex_name, coin_id);
            } else {
                console.log("issue with file ", file, eachData);
            }
        } catch (ee) {
            console.log("Error ", ee);
        }
    });

}
async function insertDBRecon(price, ex_name, coin_id) {
    try {
        let tQ_sel = 'SELECT id FROM `onramp`.`exchange_table` WHERE coin_id=? AND ex_name=?';
        let res_sel = await dbHandle.commonQuery(tQ_sel, [coin_id, ex_name]);
        if (res_sel.length > 0) {
            var tQ_ju = `UPDATE onramp.exchange_table SET price=? WHERE coin_id=? AND ex_name=?`;
            var val_ju = [price, coin_id, ex_name];
            await dbHandle.commonQuery(tQ_ju, val_ju);
        } else {
            var tQ_in = "INSERT INTO onramp.exchange_table (coin_id,ex_name,price) VALUES (?,?,?)"
            var val_in = [coin_id, ex_name, price];
            let res_in = await dbHandle.commonQuery(tQ_in, val_in);
        }
    } catch (ee) {
        console.log("Error in testDB ", ee);
    }
}
let globLock = false;
setTimeout(async () => {
    try {
        globLock = true;
        await start();
        globLock = false;
    } catch (ee) {
        globLock = false;
        console.log("Error in start ", ee);
    }
}, 1000);
async function startAgain() {
    try {
        if (!globLock) {
            globLock = true;
            await start();
            globLock = false;
        }
    } catch (ee) {
        globLock = false;
        console.log("Error in start ", ee);
    }
}
setInterval(startAgain, 2 * 1000);


