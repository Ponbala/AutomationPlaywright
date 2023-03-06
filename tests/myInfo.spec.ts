import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, testData: TestData, page: Page, utils: Utils;

enum values1 {
  firstName = "Pon",
  middleName = "L",
  lastName = "Balan",
  nickName = "Agilesh",
}

enum values2 {
  employeeId = "10",
  otherId = "11",
  driverLicenseNumber = "123",
  ssnNumber = "110",
  sinNumber = "111",
}

enum values3 {
  street1 = "KLS",
  street2 = "Mak",
  city = "Pol",
  state = "TN",
  zip = "600097",
  home = "7777777771",
  mobile = "777777772",
  work = "7777777773",
  workEmail = "pon@hrm.com",
  otherEmail = "ba@hrm.com",
}

enum values4 {
  name = "Lin",
  relationship = "Father",
  homeTelephone = "7246363727",
  mobile = "777777777",
  workTelephone = "77777776"
}

let nameValues = [values1.firstName, values1.middleName, values1.lastName, values1.nickName];
let idValues = [values2.employeeId, values2.otherId, values2.driverLicenseNumber, values2.ssnNumber, values2.sinNumber];
let contactDetailValues = [values3.street1, values3.street2, values3.city, values3.state, values3.zip, values3.home, values3.mobile, values3.work, values3.workEmail, values3.otherEmail];
let emergencyContactValues = [values4.name, values4.relationship, values4.homeTelephone, values4.mobile, values4.workTelephone];

let namesLocators = [];
let idLocators = [];
let contactDetailsLocators = [];
let emergencyContactLocators = [];

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
    namesLocators = [myInfoPage.firstName, myInfoPage.middleName, myInfoPage.lastName, myInfoPage.nickName];
    await myInfoPage.fillFieldValues(namesLocators, nameValues);
  });

  test('Filling the Id section', async () => {
    idLocators = [myInfoPage.employeeId, myInfoPage.otherId, myInfoPage.driverLicenseNumber, myInfoPage.ssnNumber, myInfoPage.sinNumber];
    await myInfoPage.fillFieldValues(idLocators, idValues);
    await myInfoPage.fillDateValue(myInfoPage.licenseExpiryDate, '2030-11-25');
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
    await myInfoPage.uploadFile('uploadTextFile.txt', false);
  });

  test('Filling the personal details and verifying save button', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', true);
    expect(page.locator(myInfoPage.table)).toBeVisible();
    await page.waitForTimeout(4000);
  });

  test('Deleting the existing attachments', async () => {
    await myInfoPage.click(myInfoPage.attachmentCheckBox);
    await myInfoPage.deleteExistingFiles();
  });

  test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', true);
    await myInfoPage.deleteAttachedFile("cancel");
    await myInfoPage.deleteAttachedFile("save");
  });
});

test.describe('Filling Contact details', () => {
  test('Filling the Address section fields', async () => {
    await myInfoPage.clickContactDetailsMenu();
    contactDetailsLocators = [myInfoPage.contactDetailsLocators.street1, myInfoPage.contactDetailsLocators.street2,
    myInfoPage.contactDetailsLocators.city, myInfoPage.contactDetailsLocators.state, myInfoPage.contactDetailsLocators.zip,
    myInfoPage.contactDetailsLocators.home, myInfoPage.contactDetailsLocators.mobile, myInfoPage.contactDetailsLocators.work,
    myInfoPage.contactDetailsLocators.workEmail, myInfoPage.contactDetailsLocators.otherEmail];
    await myInfoPage.fillFieldValues(contactDetailsLocators, contactDetailValues);
    await myInfoPage.click(myInfoPage.contactDetailsLocators.country);
    await myInfoPage.selecDropdownOption('India');
    await myInfoPage.clickSave(myInfoPage.save, 0);
  });
});

test.describe('Filling Emergency Contacts details', () => {
  test('Filling Emergency Contacts details', async () => {
    await myInfoPage.clickEmergencyContactsMenu();
    await myInfoPage.clickElementWithIndex(myInfoPage.addButton, 0);
    emergencyContactLocators = [myInfoPage.emergencyContactDetails.nameInputField, myInfoPage.emergencyContactDetails.relationship, myInfoPage.emergencyContactDetails.homeTelephone, myInfoPage.emergencyContactDetails.mobile, myInfoPage.emergencyContactDetails.workTelephone];
    await myInfoPage.fillFieldValues(emergencyContactLocators, emergencyContactValues);
    await myInfoPage.clickSave(myInfoPage.save, 1);
    expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.clickCloseIcon();
    await myInfoPage.clickElementWithIndex(myInfoPage.addButton, 1);
    await myInfoPage.uploadFile('uploadTextFile.txt', true);
  });
});