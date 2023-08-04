

async function main()
{
    let response = await fetch('https://api.coindcx.com/exchange/ticker');
    response = await response.json();
    let res = []
    for(let i = 0; i < response.length; i++)
    {
        let o = response[i];
        let details = {};
        details['exchange_name'] = 'COINDCX';
        details['coin_name'] = o.market.split('INR').length == 1 ? false : o.market.split('INR')[0];
        details['prices'] = o.high;
        if(details['coin_name']){
            res.push(details);
        }
    }
    console.log(res.length)
    console.log(res[0]);
}

main()