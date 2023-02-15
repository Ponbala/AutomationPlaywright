import { chromium, firefox, webkit, Page } from '@playwright/test';

export class Utils {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async launchBrowsers() {
    const browsers = await Promise.all([
      chromium.launch(),
      firefox.launch(),
      webkit.launch(),
    ]);
  }
}