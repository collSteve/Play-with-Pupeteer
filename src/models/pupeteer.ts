import puppeteer, { Page } from "puppeteer";
import * as fs from "fs";
import { uuid } from "../utils/uuid";
const fetch = require('node-fetch')

export async function puppeteerEnvironment(args: {functions: ((page: Page)=>void)[], url: string, incognito?:boolean}) {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  for (const func of args.functions) {
    func(page);
  }

  await page.close();
  await browser.close();
}

export async function testScreenShot(url: string, fileName: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  // Type into search box.
  //   await page.type(".devsite-search-field", "Headless Chrome");

  await page.screenshot({
    path: `assets/${fileName}.png`,
    fullPage: true,
  });

  await page.close();
  await browser.close();
}

export async function logNetwork(url: string, timeout=30000) {
  console.log("log network");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('response', (response) => {
      const headers = response.headers();

      const contentType = headers['content-type'];
      console.log(`<${contentType}>: ${response.url()}`);
  });

  await page.goto(url);

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
    timeout: timeout
  });

  await page.close();
  await browser.close();

  console.log("browser closed");
}

export async function downloadSourceHtml(url: string, path: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  let bodyHTML = await page.evaluate(() => document.body.innerHTML);

  fs.writeFile(path, bodyHTML, err=> {
    if (err) {
      console.error(err);
      return;
    }
  });

  await page.close();
  await browser.close();
  console.log("browser closed");
}

export async function downloadM3U8(url: string, path: string, timeout = 30000) {
  console.log("log network");
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  page.on('response', async (response) => {
      const resUrl = response.url();
      if (resUrl.includes('m3u8')) {
        const m3u8Res = await fetch(resUrl, {
          method: 'GET'
        });
        const m3u8Text = await m3u8Res.text();

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }

        fs.writeFile(`${path}/${uuid()}.m3u8`, m3u8Text, err=>{
          if (err) {
            console.error(err);
            return;
          }
        });
      }
  });

  await page.goto(url);

  await page.close();
  await browser.close();

  console.log("browser closed");
}