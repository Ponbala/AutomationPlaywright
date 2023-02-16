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
    timeout: 10000
  },
  // fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: 'html',
  // reporter: [['@reportportal/agent-js-playwright', RPconfig]],
  use: {
    actionTimeout: 30000,
    baseURL: 'https://www.saucedemo.com',
    trace: 'on',
    headless: false,
    video: 'on',
    screenshot: 'on'
  },

  /* Configure projects for major browsers */

  projects: [
    {
      name: "Chromium",
      // fullyParallel: true,
      use: {
        browserName: "chromium",
        viewport: null,
        launchOptions: {
          args: ["--start-maximized"]
        }
      },
    },
    {
      name: "Firefox",
      fullyParallel: true,
      use: {
        browserName: "firefox",
        viewport: { width: 1366, height: 667 }
      }
    },
    {
      name: "Webkit",
      fullyParallel: true,
      use: {
        browserName: "webkit",
        viewport: { width: 1366, height: 667 }
      }
    },
  ]
  // outputDir: 'test-results/',
});
