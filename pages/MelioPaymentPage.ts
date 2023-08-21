import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage {
  readonly scheduleAPaymentButton: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.scheduleAPaymentButton = page.getByTestId('login-button-bills.newEmptyState.ctaButtonText');
  }

  async goto() {
    await test.step('Go to Payment Page', async () => {
      await this.page.goto('orgs/2838724/bills?start=0&limit=20&status=unpaid&sorting=mostRecent&search=');
      await expect(this.scheduleAPaymentButton, 'Pay page loaded').toBeVisible();
      await expect(this.page).toHaveURL(new RegExp('$bills?start=0&limit=20&status=unpaid&sorting=mostRecent&search='));
    });
  }
  async clickScheduleAPaymentButton() {
    await test.step('click Schedule a payment  page', async () => {
      await this.scheduleAPaymentButton.click();
      await expect(this.scheduleAPaymentButton, 'Pay page loaded').toBeVisible({ visible: false });
      await expect(this.page).toHaveURL(new RegExp('$bills/new/create-options'));
    });
  }
}