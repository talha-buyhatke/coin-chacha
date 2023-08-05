async function main()
{
    let result = fetch("https://www.bitget.com/v1/p2p/pub/adv/queryAdvList", {
        "body": "{\"side\":1,\"pageNo\":1,\"pageSize\":10,\"coinCode\":\"USDT\",\"fiatCode\":\"USD\",\"languageType\":0}",
        "cache": "default",
        "credentials": "include",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
            "appTheme": "dark",
            "Content-Type": "application/json;charset=utf-8",
            "FBID": "fb.1.1691213049283.468671691",
            "GACLIENTID": "1017255645.1691213048",
            "GAID": "GA1.1.1017255645.1691213048",
            "GASESSIONID": "1691239161",
            "language": "en_US",
            "locale": "en_US",
            "terminalCode": "0b44f475c7ca8c473c5d79350aedd1d6",
            "terminaltype": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15"
        },
        "method": "POST",
        "mode": "cors",
        "redirect": "follow",
        "referrer": "https://www.bitget.com/p2p-trade?fiatName=USD",
        "referrerPolicy": "strict-origin-when-cross-origin"
    })
    result = await result.json();
    console.log(result.code);
}







// const puppeteer = require('puppeteer');

// async function main() {
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.goto('https://www.bitget.com/p2p-trade?fiatName=INR');
//     await page.waitForTimeout(2000)
//     await page.waitForSelector(".item-ranks2-rigth .list-item-price");
//     let list = await page.$$(".item-ranks2-rigth .list-item-price");
//     console.log(list.length);

//     // let l = await page.evaluate(()=>{
//     //     return document.querySelectorAll('#list-item-btn-phone > span')
//     // })
//     // console.log(l.length);
//     let arr = 0;
//     for (let i = 0; i < 3; i++) {
//         let textContent = await list[i]?.evaluate(node => node.textContent);
//         textContent = textContent?.split(' ')[0];
//         console.log(textContent);
//         textContent = parseFloat(textContent);
//         arr += textContent;
//     }
//     let res = {}
//     res['avg'] = arr / 3
//     res['exchange_id'] = 'bitget';
//     console.log(res);
//     console.log(list?.length);
//     await browser.close()
// }

main()