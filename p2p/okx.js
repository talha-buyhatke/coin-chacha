const puppeteer = require('puppeteer');

async function main()
{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.okx.com/p2p-markets');
    await page.waitForTimeout(1000)
    let list = await page.$$(".price");
    let arr = 0;
    for(let i = 0; i < 3; i++)
    {
        let textContent = await list[i]?.evaluate(node => node.textContent);
        textContent = textContent.split(' ')[0];
        console.log(textContent);
        textContent = parseFloat(textContent);
        arr+=textContent;
    }
    let res = {}
     res['avg'] = arr/3
     res['exchange_id'] = 'binance';
     console.log(res);
    console.log(list?.length);
    await browser.close()
}

setInterval(main, 5000)