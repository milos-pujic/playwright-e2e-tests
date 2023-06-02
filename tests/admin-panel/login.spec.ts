import { test, expect } from '@playwright/test';
import { AdminPage } from '../../pages/AdminPage';
import { Header } from '../../pages/components/Header';

test.describe('Login Tests', () => {
  let adminPage: AdminPage;
  let header: Header;

  const style = 'style';
  const redBorder = 'border: 1px solid red;';

  test.beforeEach(async ({ page, baseURL }) => {
    adminPage = new AdminPage(page);
    header = new Header(page);
    await adminPage.hideBanner(baseURL);
    await adminPage.goto();
  });

  test('Administrator is able to login with correct username and password', async () => {
    await adminPage.login('admin', 'password');
    await expect(header.logoutLink, 'Administrator is not logged in!').toBeVisible();
  });

  test('User is not able to login with empty username', async () => {
    await adminPage.login('', 'password');
    await expect(header.logoutLink, 'User is logged in, even though it should be!').toBeHidden();
    await expect(adminPage.usernameField, 'Username field do not have red border!').toHaveAttribute(style, redBorder);
  });

  test('User is not able to login with empty password', async () => {
    await adminPage.login('admin', '');
    await expect(header.logoutLink, 'User is logged in, even though it should be!').toBeHidden();
    await expect(adminPage.passwordField, 'Password field do not have red border!').toHaveAttribute(style, redBorder);
  });

  test('User is not able to login with wrong password', async () => {
    await adminPage.login('admin', 'wrong_password');
    await expect(header.logoutLink, 'User is logged in, even though it should be!').toBeHidden();
    await expect(adminPage.usernameField, 'Username field do not have red border!').toHaveAttribute(style, redBorder);
    await expect(adminPage.passwordField, 'Password field do not have red border!').toHaveAttribute(style, redBorder);
  });
});
