const { sendAllData } = require("../utility");

async function main() {
    let response = await fetch('https://www.giottus.com/api/v2/ticker');
    response = await response.json();
    let list_of_coins = Object.keys(response);
    let result = []
    for (let i = 0; i < list_of_coins.length; i++) {
        let details = {};
        details['ex_name'] = "GIOTTUS";
        details['coin_id'] = response[list_of_coins[i]]['base_unit'].toLowerCase();
        details['price'] = response[list_of_coins[i]]['buy'];
        if (details["price"] == false || details["price"] == null || details["price"] == '0' ||
            details["coin_id"] == false || details["coin_id"] == null || details["coin_id"] == '0' || details["price"] == undefined
        )
            continue;
        result.push(details);
    }
    console.log(result.length);
    console.log(result[0]);
    await sendAllData(JSON.stringify(result), 'giottus');
    // return result;
}

main()