const utility = require('../utility');
async function main() {
    let resu = await fetch('https://www.kucoin.com/_api/otc/ad/list?currency=USDT&side=SELL&legal=INR&page=1&pageSize=10&status=PUTUP&lang=en_US');
    resu = await resu.json();
    console.log(resu);
    let arr = 0
    for (let i = 0; i < 3; i++) {
        let a = parseFloat(resu['items'][i]['premium']);
        arr += a;
    }
    let res = {}
    res['avg'] = String(arr / 3);
    res['exchange_id'] = 'KUCOIN';
    utility.sendP2P(res.avg, "KUCOIN");
    //console.log(list?.length);
}
main()