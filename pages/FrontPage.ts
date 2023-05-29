import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FrontPage extends BasePage {
  readonly pageLocator: Locator;
  readonly contactNameField: Locator;
  readonly contactEmailField: Locator;
  readonly contactPhoneField: Locator;
  readonly contactSubjectField: Locator;
  readonly contactDescriptionField: Locator;
  readonly contactSubmitButton: Locator;
  readonly contactSuccessMessage: Locator;
  readonly contactErrorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.pageLocator = page.locator('.hotel-description');
    this.contactNameField = page.getByTestId('ContactName');
    this.contactEmailField = page.getByTestId('ContactEmail');
    this.contactPhoneField = page.getByTestId('ContactPhone');
    this.contactSubjectField = page.getByTestId('ContactSubject');
    this.contactDescriptionField = page.getByTestId('ContactDescription');
    this.contactSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.contactSuccessMessage = page.locator('div.contact h2');
    this.contactErrorMessages = page.locator('.alert.alert-danger');
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.pageLocator).toBeVisible();
  }

  async sendMessage(name: string, email: string, phone: string, subject: string, description: string) {
    if (name) await this.contactNameField.type(name);
    if (email) await this.contactEmailField.type(email);
    if (phone) await this.contactPhoneField.type(phone);
    if (subject) await this.contactSubjectField.type(subject);
    if (description) await this.contactDescriptionField.type(description);
    await this.contactSubmitButton.click();
  }
}
