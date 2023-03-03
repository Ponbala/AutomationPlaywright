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
  await homePage.clickMyInfoMenu();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Filling Personal details', () => {
  test('Filling the names section', async () => {
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
    await myInfoPage.selecDropdownOption('Indian');
    await myInfoPage.click(myInfoPage.maritalStatus);
    await myInfoPage.selecDropdownOption('Single');
    await myInfoPage.fillDateValue(myInfoPage.dateofBirth, '2000-12-26');
    await myInfoPage.click(myInfoPage.gender);
    await myInfoPage.fillTextBoxValues(myInfoPage.militaryService, 'No');
    await myInfoPage.click(myInfoPage.smoker);
    await myInfoPage.clickSave(myInfoPage.save, 0);
    expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.successfulUpdatedMsg);
    await myInfoPage.clickCloseIcon();
    await myInfoPage.click(myInfoPage.bloodType);
    await myInfoPage.selecDropdownOption('A+');
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

  test('Deleting the existing attachments', async () => {
    //Deleteing Existing attachments
    await myInfoPage.click(myInfoPage.attachmentCheckBox);
    if (await myInfoPage.isDeleteButtonPresent()) {
      await (await page.waitForSelector(myInfoPage.deleteSelectedButton)).waitForElementState("stable");
      expect(page.locator(myInfoPage.deleteSelectedButton)).toBeVisible();
      await myInfoPage.click(myInfoPage.deleteSelectedButton);
      await page.waitForSelector(myInfoPage.confirmationPopup);
      await page.locator(myInfoPage.popupDeleteButton).click();
      expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
      const record = await page.locator(myInfoPage.noRecordsText).textContent();
      expect(record).toContain(Constants.noRecordsText);
    }
  });

  test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
    await myInfoPage.click(myInfoPage.addButton);
    await page.waitForSelector(myInfoPage.browseButton);
    await myInfoPage.uploadFile('uploadTextFile.txt');
    await page.waitForTimeout(5000);
    await page.locator(myInfoPage.save).last().click();
    expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.clickCloseIcon();
    await page.locator(myInfoPage.deleteIcon).first().click();
    await page.waitForSelector(myInfoPage.confirmationPopup);
    expect(await page.locator(myInfoPage.popupText).textContent()).toEqual(Constants.popupText.text);
    await page.getByRole('button', { name: /^\s*No, Cancel\s*$/i }).click();
    expect(page.locator(myInfoPage.attachemtRow).first()).toBeVisible();
    console.log("cancel passed");
    await page.locator(myInfoPage.deleteIcon).first().click();
    await page.waitForSelector(myInfoPage.confirmationPopup);
    await page.locator(myInfoPage.popupDeleteButton).click();
    expect(page.locator(myInfoPage.attachemtRow).first()).not.toBeVisible();
  });
});

test.describe('Filling Contact details', () => {
  test('Filling the Address section fields', async () => {
    await myInfoPage.clickContactDetailsMenu();
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.street1);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.street1, 'KLS');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.street2);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.street2, 'Mak');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.city);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.city, 'Pol');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.state);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.state, 'TN');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.zip);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.zip, '600097');
    await myInfoPage.click(myInfoPage.contactDetailsLocators.country);
    await myInfoPage.selecDropdownOption('India');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.home);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.home, 'pol');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.mobile);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.mobile, '7777777777');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.work);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.work, '7777777777');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.workEmail);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.workEmail, 'pon@hrm.com');
    await myInfoPage.clearTextBoxValues(myInfoPage.contactDetailsLocators.otherEmail);
    await myInfoPage.fillTextBoxValues(myInfoPage.contactDetailsLocators.otherEmail, 'ba@hrm.com');
    await myInfoPage.clickSave(myInfoPage.save, 0);
  });
});
