import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AddBillToPayPage extends BasePage {
  readonly addABillManuallyButton: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // eslint-disable-next-line max-len
    this.addABillManuallyButton = page.getByTestId('login-bill-create-option-bills.new.createOptions.addBillManually-bills.newEmptyState.ctaButtonText');
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByTestId('submit');
  }

  async clickAddBillManualy() {
    await test.step('Adding Bill mabually on Add a bill Page', async () => {
      await this.addABillManuallyButton.click();
      await expect(this.page).toHaveURL(new RegExp('$bills/new'));
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
