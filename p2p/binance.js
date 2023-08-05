const axios = require('axios');
const utility = require('../utility');

async function fetchData() {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
            headers: {
                'Content-Type': 'application/json'
            },
            data: "{\"fiat\":\"INR\",\"page\":1,\"rows\":10,\"tradeType\":\"BUY\",\"asset\":\"USDT\",\"countries\":[],\"proMerchantAds\":false,\"shieldMerchantAds\":false,\"publisherType\":null,\"payTypes\":[]}"
        };
        let sum = 0;
        let result = await axios.request(config);
        result = result.data.data;
        let jsonResult = []
        for (let i = 0; i < result.length; i++) {
            if(result[i]['advertiser']['nickName'] == null || result[i]['adv']['dynamicMaxSingleTransQuantity'] == null || result[i]['adv']['price'] == null)
            continue;
            let info = {};
            info['name'] = result[i]['advertiser']['nickName'];
            info['quantity'] = result[i]['adv']['dynamicMaxSingleTransQuantity'];
            info['price'] = result[i]['adv']['price'];
            info['url'] = 'https://p2p.binance.com/en/trade/all-payments/USDT?fiat=INR';
            info['ex_name'] = 'BINANCE'
            jsonResult.push(info);
        }
        console.log(jsonResult)

    } catch (error) {
        console.error(error);
    }
}

fetchData();
