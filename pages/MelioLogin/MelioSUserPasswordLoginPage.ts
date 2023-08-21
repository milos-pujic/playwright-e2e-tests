import { test, expect, Page, Locator } from '@playwright/test';

export class MelioSUserPasswordLoginPage{
  readonly usernameEditField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly nextPagePayButton: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    // eslint-disable-next-line max-len
    this.usernameEditField = this.page.getByTestId('input-email');
    this.passwordField = this.page.getByTestId('input-password');
    this.loginButton = this.page.getByTestId('button-auth.signIn.buttonLabel');
    this.nextPagePayButton = this.page.getByTestId('bulstton-bills.newEmptyState.ctaButtonText');
  }

  public async gotoLogin() {
    await test.step('navigating to Login page', async () => {
      await this.page.goto('https://app.meliopayments.com/login', { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL('**/login');
      await expect(this.page.url(), 'Verify user name value').toContain('https://app.meliopayments.com/login');
      await expect(this.loginButton).toBeVisible();
    });
  }

  public async setUserName(username: string) {
    await test.step('Set username on Login page', async () => {
      await this.usernameEditField.fill(username);
      await expect(this.usernameEditField, 'Verify user name value').toHaveValue(username);
    });
  }

  public async setPassword(password: string) {
    await test.step('Set password on Login page', async () => {
      await this.passwordField.fill(password);
      await expect(this.usernameEditField, 'Verify password value').toHaveValue(password);
    });
  }
  
  public async clickLoginButton() {
    await test.step('Adding Bill mabually on Add a bill Page', async () => {
      await this.loginButton.click();
      await expect(this.nextPagePayButton).toBeVisible();
    });
  }

  // async setUsername(username: string) {
  //   await test.step('set login username  on admin page', async () => {
  //     await this.usernameField.fill(username);
  //     await expect(this.usernameField, 'Admin page loaded').toHaveValue(username);
  //   });
  // }

  // async setPassword(password: string) {
  //   await test.step('set login password on admin page', async () => {
  //     await this.passwordField.fill(password);
  //     await expect(this.passwordField, 'Admin page loaded').toHaveValue(password);
  //   });
  // }

  // async clickLogin() {
  //   await test.step('click login on admin page', async () => {
  //     await this.loginButton.click();
  //   });
  // }
}
