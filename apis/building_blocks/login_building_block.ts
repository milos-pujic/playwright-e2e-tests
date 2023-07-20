import { Page } from '@playwright/test';
import { AdminPage } from '../../pages/AdminPage';

export class LoginBuildingBlock{
  readonly page: Page;
  readonly adminPage: AdminPage;
  
  constructor(page: Page, adminPage: AdminPage) {
    this.page = page;
    this.adminPage = adminPage;
  }


async login(username: string, password: string) { 
    await this.adminPage.setUsername(username);
    await this.adminPage.setPassword(password);
    await this.adminPage.clickLogin();
  }
}