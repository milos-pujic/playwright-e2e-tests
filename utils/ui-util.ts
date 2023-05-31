import { Page } from '@playwright/test';

export async function hideBanner(page: Page, baseUrl: string | undefined) {
  await page.context().addCookies([{ name: 'banner', value: 'true', url: baseUrl ? baseUrl : '/', sameSite: 'Strict' }]);
}
