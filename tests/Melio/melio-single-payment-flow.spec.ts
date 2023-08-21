import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/en';
import { Faker } from '@faker-js/faker';

import { FeatureFlagKeys } from '../../types/FeatureFlagKeys-enums';
import { LoginDetails } from '../../types/userLogin';
import userLoginData  from '../../data/userLogin.json';

import { PaymentPage } from '../../pages/MelioPaymentPage';
import { MelioSUserPasswordLoginPage } from '../../pages/MelioLogin/MelioSUserPasswordLoginPage';
//import { setup as sharedSetup } from '../../../drivers/shared.driver';
//import { setFlag } from '../../../utils/featureFlags.utils';
import { MelioLoginBuildingBlock } from '../../building-blocks/melio_login_building_block';

test.describe('single payment flow - schedule payment', () => {
  let currPaymentPage: PaymentPage;
  let currMelioLoginBuildingBlock: MelioLoginBuildingBlock;
  const currUserLoginData: LoginDetails = userLoginData;
  
  test.beforeEach(async ({ page }) => {
    currMelioLoginBuildingBlock = new MelioLoginBuildingBlock(page);
    currPaymentPage  = new PaymentPage(page);
    //currMelioLoginBuildingBlock.gotoLoginPage();
    await page.goto("https://app.meliopayments.com/login");
    //setup.setFlags();
    //sharedSetup.loginWithDemoAccount();
  });

  test('NPE off - funding source: ach (micro deposits) to ach, with legal info',() => {
    // setFlag(FeatureFlagKeys.recurringPayments, false);
    // setFlag(FeatureFlagKeys.newDashboardEnabled, false);
    // setFlag(FeatureFlagKeys.npeDashboardMigrated, false);
    // setFlag(FeatureFlagKeys.requestADemo, true);
    
    currMelioLoginBuildingBlock.login(currUserLoginData['username'] ,currUserLoginData['password'] )
    currPaymentPage.clickScheduleAPaymentButton();
    expect(currPaymentPage.page).toBeDefined();
  });
});
