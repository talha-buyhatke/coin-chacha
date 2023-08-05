const puppeteer = require('puppeteer');

async function main()
{
    const browser = await puppeteer.launch({ headless: false }); //{ headless: false }
    const page = await browser.newPage();
    await page.goto('https://www.bybit.com/fiat/trade/otc/?actionType=1&token=USDT&fiat=INR&paymentMethod=');
    await page.waitForTimeout(1500);
    const ele = await page.$('.ant-modal-close')
    await ele?.click()

    let list = await page.evaluate(()=>
        Array.from(document.querySelectorAll('.price-amount'), 
       e => e.textContent));
    console.log(list?.length);
    let arr = 0;
    for(let i = 0; i < 3; i++)
    {
        let textContent = await list[i];
        textContent = parseFloat(textContent);
        arr+=textContent;
    }
    let res = {}
     res['avg'] = arr/3
     res['exchange_id'] = 'bybit';
     console.log(res);
    console.log(list?.length);
    await browser.close()
}
main()