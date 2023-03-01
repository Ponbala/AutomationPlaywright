import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, testData: TestData, page: Page, utils: Utils;

enum Products {
  firstItem = "1",
  secondItem = "2",
  thirdItem = "3"
}

const itemsToAddCount = Object.keys(Products).length;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  // utils = new Utils(page);
  // await utils.launchBrowsers();
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  testData = new TestData(page);
});

test.beforeEach(async () => {
  await loginPage.getBaseURL();
  await expect(page).toHaveURL(/.*login/);
  let pass = await testData.encodeDecodePassword();
  await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Adding products and removing scenarios', () => {
  test('Adding the product to cart and placing the order with standard User', async () => {
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForSelector('div.orangehrm-dashboard-grid');
    await loginPage.clickMyInfoMenu();
    await page.waitForSelector('div.orangehrm-background-container');

    await page.locator('input.orangehrm-firstname').fill('');
    await page.locator('input.orangehrm-firstname').type('Pon');

    await page.locator('input.orangehrm-middlename').fill('');
    await page.locator('input.orangehrm-middlename').type('Balan');

    await page.locator('input.orangehrm-lastname').fill('');
    await page.locator('input.orangehrm-lastname').type('L');

    await page.locator(`//label[text()='Nickname']/../..//div/input`).fill('');
    await page.locator(`//label[text()='Nickname']/../..//div/input`).type('Agilesh');
    await page.locator('input.orangehrm-lastname').fill('');
    await page.locator(`//label[text()='Employee Id']/../..//div/input`).type('10');
    await page.locator('input.orangehrm-lastname').fill('');
    await page.locator(`//label[text()='Other Id']/../..//div/input`).type('11');
    await page.locator('input.orangehrm-lastname').fill('');
    await page.locator(`//label[text()="Driver's License Number"]/../..//div/input`).type('11');
    await page.locator(`//label[text()='License Expiry Date']/../..//div/input`).fill('2030-11-25');
    await page.locator('input.orangehrm-lastname').fill('');
    await page.locator(`//label[text()='SSN Number']/../..//div/input`).type('112');
    await page.locator('input.orangehrm-lastname').fill('');
    await page.locator(`//label[text()='SIN Number']/../..//div/input`).type('113');
    await page.locator(`//label[text()='Nationality']/../../..//div[@class='oxd-select-text--after']`).click();
    await page.getByRole('option', { name: 'Indian' }).getByText('Indian').click();
    await page.locator(`//label[text()='Marital Status']/../../..//div[@class='oxd-select-text--after']`).click();
    await page.getByRole('option', { name: 'Single' }).getByText('Single').click();
    await page.locator(`//label[text()='Date of Birth']/../..//div/input`).fill('2000-11-25');
    await page.locator('//label[text()="Gender"]/../../..//div[@class="oxd-radio-wrapper"]/label/input[@value="1"]').click({ force: true });
    await page.locator(`//label[text()='Military Service']/../..//div/input`).type('No');

    await page.locator(`//label[text()='Smoker']/../../..//div/label/input[@type='checkbox']`).click({ force: true });
    await page.locator('button.oxd-button--medium').first().click();
    let successMessage = await page.locator('p.oxd-text--toast-message').textContent();
    expect(successMessage).toEqual("Successfully Updated");
    await page.locator('.oxd-toast-close-container').click();

    await page.locator(`//label[text()='Blood Type']/../../../..//div/i`).click();
    await page.getByRole('option', { name: 'A+' }).getByText('A+').click();
    await page.locator('button.oxd-button--medium').nth(1).click();
    successMessage = await page.locator('p.oxd-text--toast-message').textContent();
    expect(successMessage).toEqual("Successfully Updated");
    await page.locator('.oxd-toast-close-container').click();


    await page.locator('button.oxd-button--text').click();
    await page.waitForSelector('//div[text()="Browse"]/../../..');
    await page.locator('//div[text()="Browse"]').click();
    await page.locator('.oxd-file-input').setInputFiles('uploadTextFile.txt');
    await page.locator('textarea.oxd-textarea').fill('File has been uploaded successfully');
    await page.locator('.oxd-form-actions button[type="button"]').click();
    await page.waitForSelector('.orangehrm-horizontal-padding .oxd-text.oxd-text--span');

    await page.locator('button.oxd-button--text').click();
    await page.waitForSelector('//div[text()="Browse"]/../../..');
    await page.locator('//div[text()="Browse"]').click();
    await page.locator('.oxd-file-input').setInputFiles('uploadTextFile.txt');
    await page.locator('textarea.oxd-textarea').fill('File has been uploaded successfully');
    await page.locator('.oxd-form-actions button[type="submit"]').last().click();
    successMessage = await page.locator('p.oxd-text--toast-message').textContent();
    expect(successMessage).toEqual("Successfully Saved");
    await page.locator('.oxd-toast-close-container').click();
    // await page.pause();
  });
});