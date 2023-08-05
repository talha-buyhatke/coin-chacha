const dbHandle = require('./db.js');
async function getObj(coinName) {
    try {
        let tQ_sel = 'SELECT * FROM `onramp`.`exchange_table` WHERE coin_id=?';
        let res_sel = await dbHandle.commonQuery(tQ_sel, [coinName]);
        let finalObject = {};
        // console.log(res_sel[0].ex_name, res_sel[0].price);
        finalObject['coin_id'] = coinName;
        let min = null;
        for (let i = 0; i < res_sel.length; i++) {
            finalObject[res_sel[i].ex_name] = res_sel[i].price;
            if (min == null)
                min = parseFloat(res_sel[i].price);
            else if (min > parseFloat(res_sel[i].price))
                min = parseFloat(res_sel[i].price);
        }
        finalObject['price'] = String(min);
        return finalObject;
    }
    catch (e) {

    }
}
async function getAllObjects() {
    try {
        let coinsList = ['btc', 'eth', 'matic', 'xrp', 'shib', 'doge', 'usdt', 'bnb', 'sol', 'dot']
        let finalArray = [];
        for (let i = 0; i < coinsList.length; i++) {
            let objGet = await getObj(coinsList[i]);
            finalArray.push(objGet);
        }
        return finalArray;
    }
    catch (e) {
        console.log(e);
    }
}
check();