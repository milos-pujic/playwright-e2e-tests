/* eslint-disable indent */
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

export const STORAGE_STATE = path.join(__dirname, '.auth/user.json');

const env = process.env.CURR_ENV ? process.env.CURR_ENV : 'testing';
const env_path = `./environments/.env.${env}`;

dotenv.config({
  path: env_path,
  override: true
});

function getBaseUrl() {
  const environment = process.env.ENV;
  if (environment == undefined || environment == null) return 'https://automationintesting.online/';
  else if (environment == 'prod') return 'https://automationintesting.online/';
  else if (environment == 'local') return 'http://localhost';
  else if (environment == 'kubeLocal') return 'http://kube.local';
  else if (environment == 'docker') return 'http://rbp-proxy';
  else return 'https://automationintesting.online/';
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const currentDateTime = new Date().toISOString().replace(/[:.]/g, '_').slice(0, -1);
const outputFolder = `./results/results-${currentDateTime}`;

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { open: 'never' }],
        [
          'monocart-reporter',
          {
            name: 'Playwright E2E Tests',
            outputFile: './playwright-monocart-report/index.html'
          }
        ]
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure', outputFile: outputFolder }],
        [
          'monocart-reporter',
          {
            name: 'Playwright E2E Tests',
            outputFile: './playwright-monocart-report/index.html'
          }
        ],
        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: 'my-allure-results',
            suiteTitle: true
          }
        ]
      ],
  /* Limit the number of failures on CI to save resources */
  maxFailures: process.env.CI ? 10 : undefined,
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',
  /* path to the global setup files. */
  // globalSetup: require.resolve('./setup/global.setup.ts'),
  /* path to the global teardown files. */
  // globalTeardown: require.resolve('./setup/global.teardown.ts'),
  /* Each test is given 60 seconds. */
  timeout: 60000,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseUrl(),
    /* Populates context with given storage state. */
    // storageState: './state.json',
    /* Viewport used for all pages in the context. */
    // viewport: { width: 1280, height: 720 },
    /* Capture screenshot. */
    screenshot: 'only-on-failure',
    /* Record video. */
    video: 'retain-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'off' : 'retain-on-failure',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Whether to ignore HTTPS errors when sending network requests. Defaults to `false`. */
    ignoreHTTPSErrors: true,
    /* Run browser in headless mode. */
    headless: true,
    /* Change the default data-testid attribute. */
    testIdAttribute: 'data-testid'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      testMatch: '**/*.spec.ts',
      testIgnore: 'tests/login.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
         trace: process.env.CI ? 'retain-on-failure' : 'retain-on-failure',
         storageState: STORAGE_STATE 
        },
      
      //dependencies: ['setup'],
    },

    
    //,

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
