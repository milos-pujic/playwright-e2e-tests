import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class Header extends BasePage {
  readonly roomsLink: Locator;
  readonly reportLink: Locator;
  readonly brandingLink: Locator;
  readonly messagesLink: Locator;
  readonly unreadMessagesNumber: Locator;
  readonly frontPageLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.roomsLink = page.getByRole('link', { name: 'Rooms' });
    this.reportLink = page.getByRole('link', { name: 'Report' });
    this.brandingLink = page.getByRole('link', { name: 'Branding' });
    this.messagesLink = page.locator('[href*="#/admin/messages"]');
    this.unreadMessagesNumber = page.locator('a[href*="#/admin/messages"] .notification');
    this.frontPageLink = page.getByRole('link', { name: 'Front Page' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async clickOnRooms() {
    await this.roomsLink.click();
  }

  async clickOnReport() {
    await this.reportLink.click();
  }

  async clickOnBranding() {
    await this.brandingLink.click();
  }

  async clickOnMessages() {
    await this.messagesLink.click();
  }

  async getUnreadMessagesCount() {
    return await this.unreadMessagesNumber.textContent();
  }

  async clickOnFrontPage() {
    await this.frontPageLink.click();
  }

  async clickOnLogout() {
    await this.logoutLink.click();
  }
}
