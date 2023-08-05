bitbns = async () =>
{
   let response = await fetch('https://bitbns.com/order/getTickerWithVolume/');
   response = await response.json();
   coinName = Object.keys(response);
   let result = []
   for (let i = 0; i < coinName.length; i++)
   {
      let obj = {};
      obj['exchange_name'] = 'BITBNS';
      obj['coin_name'] = coinName[i].toLowerCase();
      obj['price'] = response[coinName[i]]['yes_price'];
      result.push(obj)
   }
   console.log(result.length);
   console.log(result[0]);
   return result;
   // console.log(result.length);
   // console.log(result[0]);
}
bitbns()
