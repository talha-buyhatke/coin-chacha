const puppeteer = require('puppeteer');

async function main()
{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://p2p.binance.com/en/trade/all-payments/USDT?fiat=INR');
    await page.waitForTimeout(1000)
    let list = await page.$$(".css-r9lvvx .css-efxh6x .css-onyc9z");
    let arr = 0;
    for(let i = 0; i < 3; i++)
    {
        let textContent = await list[i]?.evaluate(node => node.textContent);
        textContent = parseFloat(textContent);
        arr+=textContent;
    }
    let res = {}
     res['avg'] = arr/3
     res['exchange_id'] = 'binance';
     console.log(res);
    // let res = await page.evaluate(()=>{
    //     return document.querySelectorAll('.css-onyc9z')
    // })
    console.log(list?.length);
    // await browser.close()
}

setInterval(main, 5000)
// main()