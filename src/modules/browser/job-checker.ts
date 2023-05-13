import { MyBrowser } from "./browser";

export class JobChecker extends MyBrowser {
  private readonly selector: string;
  constructor(jobUrl: string, selector: string) {
    super(jobUrl);
    this.selector = selector;
  }

  private async startBrowser(): Promise<void> {
    await super.setupBrowser();
    await this.openPage();
  }

  private async stopBrowser(): Promise<void> {
    await super.stop();
  }

  async getVacancies(): Promise<Array<string>> {
    await this.startBrowser();
    const vacancies = await this.getElementsText(this.selector);
    await this.stopBrowser();
    return vacancies;
  }
}
