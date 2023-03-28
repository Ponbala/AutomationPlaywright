import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, testData: TestData, page: Page, utils: Utils;

let nameValues = [Constants.EmployeeName.firstName, Constants.EmployeeName.middleName, Constants.EmployeeName.lastName, Constants.EmployeeName.nickName];
let idValues = [Constants.EmployeeIDs.employeeId, Constants.EmployeeIDs.otherId, Constants.EmployeeIDs.driverLicenseNumber, Constants.EmployeeIDs.ssnNumber, Constants.EmployeeIDs.sinNumber];
let contactDetailValues = [Constants.EmployeeContactDetails.street1, Constants.EmployeeContactDetails.street2, Constants.EmployeeContactDetails.city, Constants.EmployeeContactDetails.state, Constants.EmployeeContactDetails.zip, Constants.EmployeeContactDetails.home, Constants.EmployeeContactDetails.mobile, Constants.EmployeeContactDetails.work, Constants.EmployeeContactDetails.workEmail, Constants.EmployeeContactDetails.otherEmail];
let emergencyContactValues = [Constants.EmergencyContacts.name, Constants.EmergencyContacts.relationship, Constants.EmergencyContacts.homeTelephone, Constants.EmergencyContacts.mobile, Constants.EmergencyContacts.workTelephone];

let namesLocators = [];
let idLocators = [];
let contactDetailsLocators = [];
let emergencyContactLocators = [];

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  utils = new Utils(page);
  // await utils.launchBrowsers();
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  myInfoPage = new MyInfoPage(page);
  testData = new TestData(page);
  idLocators = [myInfoPage.myInfoPersonalDetails.employeeId, myInfoPage.myInfoPersonalDetails.otherId, myInfoPage.myInfoPersonalDetails.driverLicenseNumber, myInfoPage.myInfoPersonalDetails.ssnNumber, myInfoPage.myInfoPersonalDetails.sinNumber];
  contactDetailsLocators = [myInfoPage.contactDetailsLocators.street1, myInfoPage.contactDetailsLocators.street2, myInfoPage.contactDetailsLocators.city, myInfoPage.contactDetailsLocators.state, myInfoPage.contactDetailsLocators.zip, myInfoPage.contactDetailsLocators.home, myInfoPage.contactDetailsLocators.mobile, myInfoPage.contactDetailsLocators.work, myInfoPage.contactDetailsLocators.workEmail, myInfoPage.contactDetailsLocators.otherEmail];
  emergencyContactLocators = [myInfoPage.nameInputField, myInfoPage.emergencyContactDetails.relationship, myInfoPage.emergencyContactDetails.homeTelephone, myInfoPage.emergencyContactDetails.mobile, myInfoPage.emergencyContactDetails.workTelephone];
  await loginPage.getBaseURL();
  await expect(page).toHaveURL(/.*login/);
  let pass = await testData.encodeDecodePassword();
  await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
  await expect(page).toHaveURL(/.*dashboard/);
  await page.waitForSelector(homePage.homePageElements.dashboardGrid);
  await utils.clickMenu("link", homePage.homePageElements.myInfo, "My Info");
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Personal details', () => {
  test('Filling the names section', async () => {
    namesLocators = [myInfoPage.myInfoPersonalDetails.firstName, myInfoPage.myInfoPersonalDetails.middleName, myInfoPage.myInfoPersonalDetails.lastName, myInfoPage.myInfoPersonalDetails.nickName];
    await utils.fillFieldValues(namesLocators, nameValues);
  });

  test('Filling the Id section', async () => {
    await utils.fillFieldValues(idLocators, idValues);
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.licenseExpiryDate, '2030-11-25');
  });

  test('Filling the personal details section', async () => {
    await utils.selecDropdownOption("option", myInfoPage.myInfoPersonalDetails.nationality, 'Indian');
    await utils.selecDropdownOption("option", myInfoPage.myInfoPersonalDetails.maritalStatus, 'Single');
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.dateofBirth, '2000-12-26');
    await utils.click(myInfoPage.myInfoPersonalDetails.gender);
    await utils.fillTextBoxValues(myInfoPage.myInfoPersonalDetails.militaryService, 'No');
    await utils.click(myInfoPage.myInfoPersonalDetails.smoker);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    await utils.selecDropdownOption("option", myInfoPage.myInfoPersonalDetails.bloodType, 'A+');
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
  });

  test('Filling the personal details and verifying cancel button', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', false);
  });

  test('Filling the personal details and verifying save button', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
    await (await page.waitForSelector(myInfoPage.attachments.table)).waitForElementState("stable");
    let table = page.locator(myInfoPage.attachments.table);
    expect(table).toBeVisible();
  });

  test('Deleting the existing attachments', async () => {
    await utils.click(myInfoPage.attachments.attachmentCheckBox);
    await myInfoPage.deleteExistingFiles();
  });

  test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
    await myInfoPage.deleteAttachedFile("cancel");
    await myInfoPage.deleteAttachedFile("save");
  });
});

test.describe('Contact details', () => {
  test('Filling the Contact details section fields', async () => {
    await utils.clickMenu('link', myInfoPage.contactDetailsLocators.contactDetails, 'Contact Details');
    await utils.fillFieldValues(contactDetailsLocators, contactDetailValues);
    await utils.selecDropdownOption("option", myInfoPage.contactDetailsLocators.country, 'India');
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
  });
});

test.describe('Emergency Contacts', () => {
  test('Filling Emergency Contacts details', async () => {
    await utils.clickMenu('link', myInfoPage.emergencyContactDetails.emergencyContactMenuLink, 'Emergency Contacts');
    await myInfoPage.clickAddButton('Assigned Emergency Contacts');
    await utils.fillFieldValues(emergencyContactLocators, emergencyContactValues);
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Dependents', () => {
  test('Filling Dependents details', async () => {
    await utils.clickMenu('link', myInfoPage.dependentsDetails.dependentsMenuLink, 'Dependents');
    await myInfoPage.clickAddButton('Assigned Dependents');
    await utils.clearTextBoxValues(myInfoPage.nameInputField);
    await utils.fillTextBoxValues(myInfoPage.nameInputField, 'Gob');
    await utils.selecDropdownOption("option", myInfoPage.dependentsDetails.relationship, 'Child');
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.dateofBirth, '2000-12-26');
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Immigration', () => {
  test('Filling Immigration details', async () => {
    await utils.clickMenu('link', myInfoPage.immigrationDetails.immigrationDetailsMenuLink, 'Immigration');
    await myInfoPage.clickAddButton('Assigned Immigration Records');
    await utils.click(myInfoPage.immigrationDetails.passportOption);
    await utils.fillDateValue(myInfoPage.immigrationDetails.issuedDate, '2023-03-10');
    await utils.fillDateValue(myInfoPage.immigrationDetails.expiryDate, '2023-03-28');
    await utils.fillTextBoxValues(myInfoPage.immigrationDetails.eligibleStatus, 'Active');
    await utils.selecDropdownOption("option", myInfoPage.immigrationDetails.issuedBy, 'Albania');
    await utils.fillDateValue(myInfoPage.immigrationDetails.eligibleReviewDate, '2023-03-28');
    await utils.fillTextBoxValues(myInfoPage.immigrationDetails.comments, 'Immigration details has been filled');
    await utils.fillTextBoxValues(myInfoPage.immigrationDetails.number, '1234567');
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Qualification', () => {
  test('Filling Work Experience details', async () => {
    await utils.clickMenu('link', myInfoPage.qualifications.qualificationsMenuLink, 'Qualifications');
    await myInfoPage.clickAddButton('Work Experience');
    await utils.fillTextBoxValues(myInfoPage.workExperience.company, 'AM');
    await utils.fillTextBoxValues(myInfoPage.workExperience.jobTitle, 'Software Engineer');
    await utils.fillDateValue(myInfoPage.workExperience.fromDate, '2019-02-23');
    await utils.fillDateValue(myInfoPage.workExperience.toDate, '2025-02-23');
    await utils.fillTextBoxValues(myInfoPage.workExperience.comment, 'Filled Work Experience fields');
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
  });

  test('Filling Education details', async () => {
    await myInfoPage.clickAddButton('Education');
    await utils.selecDropdownOption("option", myInfoPage.education.level, "Bachelor's Degree");
    await utils.fillTextBoxValues(myInfoPage.education.institute, 'STC');
    await utils.fillTextBoxValues(myInfoPage.education.majorOrSpecialization, 'BSC');
    await utils.fillTextBoxValues(myInfoPage.education.year, '2015');
    await utils.fillTextBoxValues(myInfoPage.education.gpaScore, '7.2');
    await utils.fillTextBoxValues(myInfoPage.education.startDate, '2012-04-15');
    await utils.fillTextBoxValues(myInfoPage.education.endDate, '2015-04-15');
    await utils.clickSave(myInfoPage.save, 1);
  });

  test('Filling Skills details', async () => {
    await myInfoPage.clickAddButton('Skills');
    await utils.selecDropdownOption("option", myInfoPage.skills.skill, "Java");
    await utils.fillTextBoxValues(myInfoPage.skills.yearsOfExperience, '4');
    await utils.fillTextBoxValues(myInfoPage.skills.comment, 'Filled Skills fields');
    await utils.clickSave(myInfoPage.save, 1);
  });

  test('Filling Languages details', async () => {
    await myInfoPage.clickAddButton('Languages');
    await page.waitForTimeout(3000);
    await utils.selecDropdownOption("option", myInfoPage.languages.language, "English");
    await utils.selecDropdownOption("option", myInfoPage.languages.fluency, "Writing");
    await utils.selecDropdownOption("option", myInfoPage.languages.competency, "Good");
    await utils.fillTextBoxValues(myInfoPage.languages.comment, 'Filled Languages fields');
    await utils.clickSave(myInfoPage.save, 1);
  });

  test('Filling License details', async () => {
    await myInfoPage.clickAddButton('License');
    await utils.selecDropdownOption("option", myInfoPage.license.licenseType, "Cisco Certified Network Associate (CCNA)");
    await utils.fillTextBoxValues(myInfoPage.license.licenseNumber, "123456");
    await utils.fillTextBoxValues(myInfoPage.license.issuedDate, '2015-04-15');
    await utils.fillTextBoxValues(myInfoPage.license.expiryDate, '2015-05-15');
    await utils.clickSave(myInfoPage.save, 1);
  });

  test('Attachment section', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Memberships', () => {
  test('Filling Assigned Memberships details', async () => {
    await utils.clickMenu('link', myInfoPage.memberships.membershipMenuLink, 'Memberships');
    await myInfoPage.clickAddButton('Assigned Memberships');
    await utils.selecDropdownOption("option", myInfoPage.memberships.membership, "ACCA");
    await utils.selecDropdownOption("option", myInfoPage.memberships.subscriptionPaidBy, "Company");
    await utils.fillTextBoxValues(myInfoPage.memberships.subscriptionAmount, "42000");
    await utils.selecDropdownOption("option", myInfoPage.memberships.currency, "Indian Rupee");
    await utils.fillTextBoxValues(myInfoPage.memberships.subscriptionCommenceDate, "2023-03-21");
    await utils.fillTextBoxValues(myInfoPage.memberships.subscriptionRenewalDate, "2023-03-23");
    await utils.clickSave(myInfoPage.save, 1);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});