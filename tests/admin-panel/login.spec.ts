import { test, expect } from '@playwright/test';
import { AdminPage } from '../../pages/AdminPage';
import { Header } from '../../pages/components/Header';
import { LoginBuildingBlock } from '../../building-blocks/login_building_block';

test.describe('Login Tests', () => {
  let adminPage: AdminPage;
  let loginBuildingBlock: LoginBuildingBlock;
  let header: Header;

  const style = 'style';
  const redBorder = 'border: 1px solid red;';

  test.beforeEach(async ({ page, baseURL }) => {
    adminPage = new AdminPage(page);
    loginBuildingBlock = new LoginBuildingBlock(page, adminPage);
    header = new Header(page);

    await adminPage.hideCookieBanner(baseURL);
    await adminPage.goto();
  });

  test('Administrator is able to login with correct username and password @sanity @login', async () => {
    await loginBuildingBlock.login('admin', 'password');
    await expect(header.logoutLink, 'Administrator logged in!').toBeVisible();
  });

  test('User is not able to login with empty username @login', async () => {
    await loginBuildingBlock.login('', 'password');
    await expect(header.logoutLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.usernameField, 'Username field has red border!').toHaveAttribute(style, redBorder);
  });

  test('User is not able to login with empty password @login', async () => {
    await loginBuildingBlock.login('admin', '');
    await expect(header.logoutLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.passwordField, 'Password field has red border!').toHaveAttribute(style, redBorder);
  });

  test('User is not able to login with wrong password @login', async () => {
    await loginBuildingBlock.login('admin', 'wrong_password');
    await expect(header.logoutLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.usernameField, 'Username field has red border!').toHaveAttribute(style, redBorder);
    await expect(adminPage.passwordField, 'Password field has red border!').toHaveAttribute(style, redBorder);
  });
});
