
const puppeteer = require('puppeteer');

async function main()
{
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.bitget.com/p2p-trade?fiatName=INR');
    // await page.waitForTimeout(2000)
    let list = await page.$('#list-item-btn-phone_1059991115941859329 > span');
    let textContent = await list?.evaluate(node => node.textContent);
    //steps_guide_footer-left_btn
    console.log(textContent);
    //*[@id="hall-publish-list_item-box"]/div/div[1]/span[2]

    // let l = await page.evaluate(()=>{
    //     return document.querySelectorAll('#list-item-btn-phone > span')
    // })
    // console.log(l.length);
    // let arr = 0;
    // for(let i = 0; i < 3; i++)
    // {
    //     let textContent = await list[i]?.evaluate(node => node.textContent);
    //     textContent = textContent?.split(' ')[0];
    //     console.log(textContent);
    //     textContent = parseFloat(textContent);
    //     arr+=textContent;
    // }
    // let res = {}
    //  res['avg'] = arr/3
    //  res['exchange_id'] = 'bitget';
    //  console.log(res);
    // console.log(list?.length);
    //await browser.close()
}

main()