import { defineConfig, devices } from '@playwright/test';

const RPconfig = {
  token: '8be9d121-af6a-44da-be10-61cb0e73fe10',
  endpoint: 'https://demo.reportportal.io/api/v1',
  project: 'ponbala_personal',
  launch: 'Playwright test',
  attributes: [
    {
      key: 'key',
      value: 'value',
    },
    {
      value: 'value',
    },
  ],
  description: 'Playwright Sample',
};

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 60 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: 'html',
  // reporter: [['@reportportal/agent-js-playwright', RPconfig]],
  use: {
    actionTimeout: 30000,
    baseURL: 'https://www.saucedemo.com',
    trace: 'on',
    // viewport: null,
    headless: false,
    video: 'on',
    screenshot: 'on',
    // browserName: 'chromium',
    // launchOptions: {
    //   args: ["--start-maximized"]
    // }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  outputDir: 'test-results/',
});
