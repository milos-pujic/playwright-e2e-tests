import { expect, Locator, Page } from '@playwright/test';
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
    await this.page.goto('/#/admin');
    await expect(this.pageHeader, 'Admin page not loaded!').toBeVisible();
  }

  async fillInLogin(userName: string, password: string) {
    await this.usernameField.type(userName);
    await this.passwordField.type(password);
  }

  async login(username: string, password: string) {
    await this.fillInLogin(username, password);
    await this.loginButton.click();
  }
}
