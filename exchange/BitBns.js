const utility = require('../utility');

bitbns = async () => {
   let response = await fetch('https://bitbns.com/order/getTickerWithVolume/');
   response = await response.json();
   coinName = Object.keys(response);
   let result = []
   for (let i = 0; i < coinName.length; i++) {
      let obj = {};
      obj["ex_name"] = 'BITBNS';
      obj["coin_id"] = coinName[i].toLowerCase();
      obj["price"] = String(response[coinName[i]]['yes_price']);
      result.push(obj)
   }
   console.log(result.length);
   console.log(result[0]);
   utility.sendAllData(JSON.stringify(result), 'bitbns');
   // console.log(result.length);
   // console.log(result[0]);
}

