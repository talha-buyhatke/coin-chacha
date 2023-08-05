const utility = require('../utility');

async function main() {
    let response = await fetch("https://cs-india.coinswitch.co/api/v2/external/csk_website/currencies");
    response = await response.json();
    response = response.data.currencies;
    let res = []
    for (let i = 0; i < response.length; i++) {
        let details = {};
        details['ex_name'] = 'COINSWITCH';
        details['coin_id'] = response[i].currency;
        details['price'] = response[i].price.replace(/,/g, '');;
        // console.log(details["price"] == false || details["price"] == null || details["price"] == '0');
        if (details["price"] == false || details["price"] == null || details["price"] == '0' ||
            details["coin_id"] == false || details["coin_id"] == null || details["coin_id"] == '0' || details["price"] == undefined
        )
            continue;
        res.push(details);
    }
    console.log(res.length)
    console.log(res[0]);
    utility.sendAllData(JSON.stringify(res), 'coinswitch');
}

main()