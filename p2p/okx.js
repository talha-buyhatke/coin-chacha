async function main()
{
    let res = await fetch('https://www.okx.com/v3/c2c/tradingOrders/getMarketplaceAdsPrelogin?t=1691234271455&side=sell&paymentMethod=all&userType=all&hideOverseasVerificationAds=false&sortType=price_asc&urlId=2&limit=100&cryptoCurrency=usdt&fiatCurrency=inr&currentPage=1&numberPerPage=5')
    res = await res.json();
    console.log(res);
}

setInterval(main, 5000)