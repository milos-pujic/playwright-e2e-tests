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

  async setUsername(username: string){
    await test.step('set login username  on admin page', async () => {
      await this.usernameField.fill(username);
      await expect(this.usernameField, 'Admin page loaded').toHaveValue(username);
    });
  }

  async setPassword(password: string){
    await test.step('set login password on admin page', async () => {
      await this.passwordField.fill(password);
      await expect(this.passwordField, 'Admin page loaded').toHaveValue(password);
    });
  }

  async clickLogin(){
    await test.step('click login on admin page', async () => {
      await this.loginButton.click();
      await expect(this.loginButton, 'Admin page loaded').not.toBeVisible;
    });
  }
}
