const utility = require('../utility');

async function main() {
    let response = await fetch('https://api.coindcx.com/exchange/ticker');
    response = await response.json();
    // console.log(response);
    let res = []
    for (let i = 0; i < response.length; i++) {
        let o = response[i];
        let details = {};
        details['ex_name'] = 'COINDCX';
        details['coin_id'] = o.market.split('INR').length == 1 ? false : o.market.split('INR')[0].toLowerCase();
        details['price'] = String(o.high);
        // console.log(details["price"] == false || details["price"] == null || details["price"] == '0');
        if (details["price"] == false || details["price"] == null || details["price"] == '0' ||
            details["coin_id"] == false || details["coin_id"] == null || details["coin_id"] == '0' || details["price"] == undefined
        )
            continue;
        res.push(details);
    }
    console.log(res.length)
    console.log(res[0]);
    utility.sendAllData(JSON.stringify(res), 'coindcx');
}

main()