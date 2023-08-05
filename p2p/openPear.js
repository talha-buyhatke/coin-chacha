async function main()
{
    let result = await fetch('https://app.openpeer.xyz/api/lists?chain_id=137&page=1&type=SellList&currency=11&token=9')
    result = await result.json();
    console.log(result['data'].length);
    let jsonResult = [];
    for(let i = 0; i < result['data'].length; i++)
    {
        if(result['data'][i]['seller']['name'] == null || result['data'][i]['total_available_amount'] == null|| result['data'][i]['price'] == null)
        continue;
        let info = {};
        info['name'] = result['data'][i]['seller']['name'];
        info['quantity'] =  result['data'][i]['total_available_amount'];
        info['price'] = result['data'][i]['price'];
        info['url'] = 'https://app.openpeer.xyz/trade';
        info['ex_name'] = 'OPENPEAR'
        jsonResult.push(info);
    }
    console.log(jsonResult);
}
main()

