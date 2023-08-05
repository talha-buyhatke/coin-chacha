async function main()
{
    let result = await fetch('https://www.okx.com/v3/c2c/tradingOrders/getMarketplaceAdsPrelogin?cryptoCurrency=usdt&fiatCurrency=inr')
    result = await result.json();
    console.log(result['data']['buy'].length);
    let jsonResult = []
    for(let i = 0; i < result['data']['buy'].length; i++)
    {
        if(result['data']['buy'][i]['nickName'] == null || result['data']['buy'][i]['availableAmount'] == null || result['data']['buy'][i]['price'] == null)
        continue
        let info = {};
        info['name'] = result['data']['buy'][i]['nickName'];
        info['quantity'] =  result['data']['buy'][i]['availableAmount'];
        info['price'] = result['data']['buy'][i]['price'];
        info['url'] = 'www.okx.com/p2p-markets';
        info['ex_name'] = 'OKX'
        jsonResult.push(info);
    }
    console.log(jsonResult);
}
main()