import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async hideBanner(baseUrl: string | undefined) {
    await this.page.context().addCookies([{ name: 'banner', value: 'true', url: baseUrl ? baseUrl : '/', sameSite: 'Strict' }]);
  }
}
