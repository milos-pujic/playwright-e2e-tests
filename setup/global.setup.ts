import { FullConfig, chromium } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([{ name: 'banner', value: 'true', url: baseURL }]);
  await context.storageState({ path: storageState as string });
  await context.close();
}

export default globalSetup;
