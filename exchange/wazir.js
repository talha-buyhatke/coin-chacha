const { sendAllData } = require("../utility");
async function main() {
    let response = await fetch("https://x.wazirx.com/wapi/v1/tickers/24hr", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "api-key": "WRXPRODWn5Kc36$#%WYjguL;1oUYnD9ijiIHE7bk3r78%3#mFHJdik3n1Uafgib98*GI",
            "isbrowser": "true",
            "platform": "web",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "timezone": "Asia/Calcutta"
        },
        "referrer": "https://wazirx.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    })
    response = await response.json();
    let result = [];
    for (let i = 0; i < response.length; i++) {
        let details = {};
        if (response[i].symbol.includes('inr')) {
            details['ex_name'] = "WAZIRX";
            details['coin_id'] = response[i].baseAsset;
            details['price'] = response[i].bidPrice;
            if (details["price"] == false || details["price"] == null || details["price"] == '0' ||
                details["coin_id"] == false || details["coin_id"] == null || details["coin_id"] == '0' || details["price"] == undefined
            )
                continue;
            result.push(details);
        }
    }
    console.log(result.length);
    console.log(result[0]);
    await sendAllData(JSON.stringify(result), 'wazir');
    // return result;
}

main()