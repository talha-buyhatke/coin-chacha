async function main()
{
    let resu = await fetch('https://www.kucoin.com/_api/otc/ad/list?currency=USDT&side=SELL&legal=INR&page=1&pageSize=10&status=PUTUP&lang=en_US');
    resu = await resu.json();
    let arr = 0
    for(let i = 0; i < 3; i++)
    {
        let a = parseFloat(resu['items'][i]['premium']);
        arr+=a;
    }
    let res = {}
     res['avg'] = arr/3
     res['exchange_id'] = 'kucoin';
     console.log(res);
    //console.log(list?.length);
}
main()