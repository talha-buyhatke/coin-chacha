async function main()
{
    let response = await fetch('https://www.giottus.com/api/v2/ticker');
    response = await response.json();
    let list_of_coins = Object.keys(response);
    let result = []
    for(let i = 0; i < list_of_coins.length; i++)
    {
        let details = {};
        details['exchange_name'] = "WAZIR";
        details['coin_name'] = response[list_of_coins[i]]['base_unit'];
        details['price'] = response[list_of_coins[i]]['buy'];
        result.push(details);
    }
    console.log(result.length);
    console.log(result[0]);
    return result;
}

main()