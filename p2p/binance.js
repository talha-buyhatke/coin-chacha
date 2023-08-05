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
        let response = await axios.request(config);
        response = response.data.data;
        // console.log(response.length);
        for (let i = 0; i < response.length; i++) {
            // console.log(response[i].adv.price)
            sum += parseFloat(response[i].adv.price);
            if (i == 2)
                break;
        }
        let average = sum / (3.0);
        console.log(average);
        utility.sendP2P(average, "BINANCE");
        // console.log(JSON.stringify(response.data));

    } catch (error) {
        console.error(error);
    }
}

fetchData();
