async function main()
{
    let result = await fetch('https://www.huobi.com/-/x/otc/v1/data/trade-market?coinId=2&currency=4&tradeType=sell&currPage=1&payMethod=0&acceptOrder=0&country=&blockType=general&online=1&range=0&amount=&onlyTradable=false&isFollowed=false');
    result = await result.json()
    console.log(result['data'].length);
    let jsonResult = [];
    for(let i = 0; i < result['data'].length; i++)
    {
        if(result['data'][i]['userName'] == null || result['data'][i]['tradeCount'] == null || result['data'][i]['price'] == null)
        continue;
        let info = {};
        info['name'] = result['data'][i]['userName'];
        info['quantity'] =  result['data'][i]['tradeCount'];
        info['price'] = result['data'][i]['price'];
        info['url'] = 'https://www.huobi.com/en-us/fiat-crypto/trade/buy-usdt-inr/';
        info['ex_name'] = 'HUOBI'
        jsonResult.push(info);
    }
    console.log(jsonResult); 
}
main()