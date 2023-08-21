import { Page } from '@playwright/test';
import { MelioSUserPasswordLoginPage } from '../pages/MelioLogin/MelioSUserPasswordLoginPage';

export class MelioLoginBuildingBlock {
  readonly page: Page;
  readonly loginPage: MelioSUserPasswordLoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new MelioSUserPasswordLoginPage(this.page);
  }
  async login(username: string, password: string) {
    //await this.loginPage.gotoLogin();
    await this.loginPage.setUserName(username);
    await this.loginPage.setPassword(password);
    await this.loginPage.clickLoginButton();
  }

  async gotoLoginPage(){
    await this.loginPage.gotoLogin();
  }
}
