import { HTTPResponse, Page, PuppeteerLifeCycleEvent } from "puppeteer";
import * as fs from "fs";

type Action<InputType, OutputType> = (args: {page: Page, input: InputType}) => OutputType;

class Execution<InputType, OutputType> {
    action: Action<InputType, OutputType>;

    fromExecutions: {execution: Execution<any, any>, propertyConversion: {
        fromProp: string,
        toProp: string; 
    }[]}[] = [];

    toExecutions: {execution: Execution<any, any>, propertyConversion: {
        fromProp: string,
        toProp: string; 
    }[]}[] = [];

    currentOuput: OutputType | null = null;

    constructor(action: Action<InputType, OutputType>) {
        this.action = action;
    }

    convertProps(): InputType {
        const input: {[key: string]: any} = {};
        for (const exe of this.fromExecutions) {
            for (const props of exe.propertyConversion) {
                input[props.toProp] = exe.execution.currentOuput[props.fromProp];
            }
        }
        return input as InputType;
    }

    execute(input: InputType, page: Page): OutputType {
        this.currentOuput = this.action({page, input});
        return this.currentOuput;
    }
}   

export const screenShotAction: Action<{fileName: string}, Promise<void>> = async (args)=> {
    await args.page.screenshot({
      path: `assets/${args.input.fileName}.png`,
      fullPage: true,
    });
}

export function registerNetworkResponseAction(
  onNetworkResponse: (response: HTTPResponse) => void
) {
  return function (page: Page) {
    page.on("response", (response) => {
      onNetworkResponse(response);
    });
  };
}

// log net work
// registerNetworkResponseAction((response) => {
//   const headers = response.headers();

//   const contentType = headers["content-type"];
//   console.log(`<${contentType}>: ${response.url()}`);
// });

export function logNetwork(
  url: string,
  timeout = 30000,
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[]
) {
  return async function (page: Page) {
    page.on("response", (response) => {
      const headers = response.headers();

      const contentType = headers["content-type"];
      console.log(`<${contentType}>: ${response.url()}`);
    });

    await page.goto(url);
    await page.waitForNavigation({
      waitUntil: waitUntil,
      timeout: timeout,
    });
  };
}

export function getScourceHtmlAction() {
  return async function (page: Page) {
    return await page.evaluate(() => document.body.outerHTML);
  };
}

export const downloadAction = (content: string, path: string) => () =>
  downloadContent(content, path);

export function downloadContent(content: string, path: string) {
  fs.writeFile(path, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
