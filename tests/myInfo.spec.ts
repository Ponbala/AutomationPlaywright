import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  // utils = new Utils(page);
  // await utils.launchBrowsers();
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  myInfoPage = new MyInfoPage(page);
  testData = new TestData(page);
});

test.beforeAll(async () => {
  await loginPage.getBaseURL();
  await expect(page).toHaveURL(/.*login/);
  let pass = await testData.encodeDecodePassword();
  await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
  await expect(page).toHaveURL(/.*dashboard/);
  await page.waitForSelector(homePage.dashboardGrid);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Filling Personal details', () => {
  test('Filling the names section', async () => {
    await homePage.clickMyInfoMenu();
    await myInfoPage.clearTextBoxValues(myInfoPage.firstName);
    await myInfoPage.fillTextBoxValues(myInfoPage.firstName, 'Pon');
    await myInfoPage.clearTextBoxValues(myInfoPage.middleName);
    await myInfoPage.fillTextBoxValues(myInfoPage.middleName, 'L');
    await myInfoPage.clearTextBoxValues(myInfoPage.lastName);
    await myInfoPage.fillTextBoxValues(myInfoPage.lastName, 'Balan');
    await myInfoPage.clearTextBoxValues(myInfoPage.nickName);
    await myInfoPage.fillTextBoxValues(myInfoPage.nickName, 'Agilesh');
  });

  test('Filling the Id section', async () => {
    await myInfoPage.clearTextBoxValues(myInfoPage.employeeId);
    await myInfoPage.fillTextBoxValues(myInfoPage.employeeId, '10');
    await myInfoPage.clearTextBoxValues(myInfoPage.otherId);
    await myInfoPage.fillTextBoxValues(myInfoPage.otherId, '11');
    await myInfoPage.clearTextBoxValues(myInfoPage.driverLicenseNumber);
    await myInfoPage.fillTextBoxValues(myInfoPage.driverLicenseNumber, '123');
    await myInfoPage.fillDateValue(myInfoPage.licenseExpiryDate, '2030-11-25');
    await myInfoPage.clearTextBoxValues(myInfoPage.ssnNumber);
    await myInfoPage.fillTextBoxValues(myInfoPage.ssnNumber, '110');
    await myInfoPage.clearTextBoxValues(myInfoPage.ssnNumber);
    await myInfoPage.fillTextBoxValues(myInfoPage.ssnNumber, '111');
  });

  test('Filling the personal details section', async () => {
    await myInfoPage.click(myInfoPage.nationality);
    await myInfoPage.selecDropdownOption('option', 'Indian');
    await myInfoPage.click(myInfoPage.maritalStatus);
    await myInfoPage.selecDropdownOption('option', 'Single');
    await myInfoPage.fillDateValue(myInfoPage.dateofBirth, '2000-12-26');
    await myInfoPage.click(myInfoPage.gender);
    await myInfoPage.fillTextBoxValues(myInfoPage.militaryService, 'No');
    await myInfoPage.click(myInfoPage.smoker);
    await myInfoPage.clickSave(myInfoPage.save, 0);
    expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.successfulUpdatedMsg);
    await myInfoPage.clickCloseIcon();
    await myInfoPage.click(myInfoPage.bloodType);
    await myInfoPage.selecDropdownOption('option', 'A+');
    await myInfoPage.clickSave(myInfoPage.save, 1);
    expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.successfulUpdatedMsg);
    await myInfoPage.clickCloseIcon();
  });

  test('Filling the personal details and verifying cancel button', async () => {
    await myInfoPage.click(myInfoPage.addButton);
    await page.waitForSelector(myInfoPage.browseButton);
    await myInfoPage.click(myInfoPage.browseButton);
    await myInfoPage.uploadFile('uploadTextFile.txt');
    await myInfoPage.fillTextBoxValues(myInfoPage.commentBox, Constants.fillText.comment);
    await myInfoPage.click(myInfoPage.cancel);
    await page.waitForSelector(myInfoPage.noRecordsText);
  });

  test('Filling the personal details and verifying save button', async () => {
    await myInfoPage.click(myInfoPage.addButton);
    await page.waitForSelector(myInfoPage.browseButton);
    // await page.setInputFiles(".oxd-file-input",'./uploadTextFile.txt');
    page.on("filechooser", async (filechooser) => {
      await filechooser.setFiles('uploadTextFile.txt')
    });
    await myInfoPage.click(myInfoPage.browseButton);
    await myInfoPage.fillTextBoxValues(myInfoPage.commentBox, Constants.fillText.comment);
    await page.locator(myInfoPage.save).last().click();
    expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.clickCloseIcon();
    expect(page.locator(myInfoPage.table)).toBeVisible();
    await page.waitForTimeout(4000);
  });

  test('Uploading the document and checking the checkbox and performing delete operation', async () => {
    // const record = await page.locator('.orangehrm-horizontal-padding .oxd-text.oxd-text--span').textContent();
    // expect(record).toContain("Record Found");
    await myInfoPage.click(myInfoPage.attachmentCheckBox);
    await (await page.waitForSelector(myInfoPage.deleteSelectedButton)).waitForElementState("stable");
    expect(page.locator(myInfoPage.deleteSelectedButton)).toBeVisible();

    await myInfoPage.click(myInfoPage.attachmentCheckBox);
    expect(page.locator(myInfoPage.deleteSelectedButton)).not.toBeVisible();
    await page.locator(myInfoPage.deleteIcon).first().click();
    await page.waitForSelector(myInfoPage.confirmationPopup);
    expect(await page.locator(myInfoPage.popupText).textContent()).toEqual(Constants.popupText.text);
    await page.getByRole('button', { name: /^\s*No, Cancel\s*$/i }).click();
    expect(page.locator(myInfoPage.attachemtRow).first()).toBeVisible();
    console.log("cancel passed");
    // await page.locator(myInfoPage.deleteIcon).first().click();
    // await page.waitForSelector(myInfoPage.confirmationPopup);
    // await page.getByRole('button', { name: /^\s*Yes, Delete\s*$/i }).click();
    // expect(page.locator(myInfoPage.attachemtRow).first()).not.toBeVisible();
  });
});