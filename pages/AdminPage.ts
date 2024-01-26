import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly pageHeader: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByTestId('login-header');
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByTestId('submit');
  }

  async goto() {
    await test.step('Go to Admin Page', async () => {
      await this.page.goto('/#/admin');
      await expect(this.pageHeader, 'Admin page loaded').toBeVisible();
    });
  }

  async login(username: string, password: string) {
    await test.step(`Log in using with username: ${username} and password: ${password}`, async () => {
      await this.usernameField.fill(username);
      await this.passwordField.fill(password);
      await this.loginButton.click();
    });
  }
}
