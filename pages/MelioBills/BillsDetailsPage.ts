import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BillDetailsPage extends BasePage {
  readonly vendorNameField: Locator;
  readonly billAmountField: Locator;
  readonly dueDateContainer: Locator;
  readonly schedulePaymentButton: Locator;

  constructor(page: Page) {
    super(page);
    // eslint-disable-next-line max-len
    this.vendorNameField = page.getByTestId('Details');
    this.billAmountField = page.getByTestId('input-totalAmount');
    this.dueDateContainer = page.getByTestId('input-dueDate-container');

    this.schedulePaymentButton = page.getByTestId('button-bills.new.saveAndAdd');
  }

  async setVendor(vendorName: string) {
    await test.step('Adding Bill aount on  bill details page', async () => {
      await this.vendorNameField.fill(vendorName);
      await expect(this.vendorNameField).toHaveValue(vendorName);
    });
  }

  async setBillAmount(billAmount: string) {
    await test.step('Setting Bill amount  on a bill details Page', async () => {
      await this.billAmountField.fill(billAmount);
      await expect(this.billAmountField).toHaveValue(billAmount);
    });
  }

  async setDueDate(billAmount: string) {
    await test.step('Setting Bill amount  on a bill details Page', async () => {
      const desiredDate = '2023-08-22';
      //set date to date picker
      await this.dueDateContainer.click({ clickCount: 3 }); // Select all existing text
      await this.dueDateContainer.press('Backspace'); // Clear existing text
      await this.dueDateContainer.type(desiredDate);
      await expect(this.billAmountField).toHaveValue(billAmount);
    });
  }
}
