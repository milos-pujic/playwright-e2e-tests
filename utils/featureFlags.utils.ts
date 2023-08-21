import { featureFlags } from '@melio/shared-web';
import { Page } from '@playwright/test';

async function setFlags(flagNmae: String, value: unknown, page: Page) {
  await page.evaluate('window.then((win) => featureFlags.setFlagOvr(win, flagName, value))');
};

