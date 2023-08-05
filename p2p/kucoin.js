const utility = require('../utility');
async function main() {
    let result = await fetch('https://www.kucoin.com/_api/otc/ad/list?currency=USDT&side=SELL&legal=INR&page=1&pageSize=10&status=PUTUP&lang=en_US');
    result = await result.json();
    let jsonResult = [];
    for(let i = 0; i < result['items'].length; i++)
    {
        if(result['items'][i]['nickName'] == null || result['items'][i]['currencyQuantity'] == null || result['items'][i]['floatPrice'] == null)
        continue;
        let info = {};
        info['name'] = result['items'][i]['nickName'];
        info['quantity'] =  result['items'][i]['currencyQuantity'];
        info['price'] = result['items'][i]['floatPrice'];
        info['url'] = 'https://www.kucoin.com/otc/buy/USDT-USD';
        info['ex_name'] = 'KUCOIN'
        jsonResult.push(info);
    }
}
main()