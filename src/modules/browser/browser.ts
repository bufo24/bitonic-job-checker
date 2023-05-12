import puppeteer, { Page } from "puppeteer";
import { Browser } from "puppeteer";

export class MyBrowser {
  private browser: Browser;
  private page: Page;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  protected async setupBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: "new" });
    this.page = await this.browser.newPage();
  }

  protected async openPage(): Promise<void> {
    await this.page.goto(this.url);
  }

  protected async getElementsText(selector: string): Promise<Array<string>> {
    const elements = await this.page.$$(selector);
    const texts: Array<string> = [];
    for (const element of elements) {
      const textContent = await element?.evaluate((el) => el.textContent);
      if (textContent) {
        texts.push(textContent);
      }
    }
    return texts;
  }

  protected async stop() {
    await this.browser.close();
  }
}
