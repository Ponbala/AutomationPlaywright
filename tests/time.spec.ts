import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, TimePage, MyInfoPage, PerformancePage } from '../pageObjects/index';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, performancePage: PerformancePage, timePage: TimePage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    // await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    myInfoPage = new MyInfoPage(page);
    performancePage = new PerformancePage(page);
    timePage = new TimePage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForSelector(homePage.homePageElements.dashboardGrid);
});


test.afterAll(async () => {
    await page.close();
});

test.describe('Time Project Info', () => {
    test('Creating users', async () => {
        await utils.deleteUsers();
        await utils.createUsers("Test", "User1", "testuser1");
        await utils.updatingUserRole("testuser1", "Admin");
    });

    test('Add Customer details', async () => {
        await utils.logout();
        await loginPage.fillUsrNameAndPwdAndLogin("testuser1", "Testuser@12");
        await expect(page).toHaveURL(/.*dashboard/);
        await page.waitForSelector(homePage.homePageElements.dashboardGrid);
        await utils.clickMenu("link", homePage.homePageElements.time, "Time");
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole("menuitem", 'Customers');
        await page.waitForTimeout(4000);
        // await timePage.deleteCustomers();
        await utils.click(performancePage.add);
        await utils.fillTextBoxValues(timePage.name, "APlay Test Ltd");
        await utils.fillTextBoxValues(timePage.description, "An AI Company");
        await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        let cellValues = await timePage.getARowByColumnText("APlay Test Ltd");
        expect(cellValues.companyName).toEqual("APlay Test Ltd");
    });

    test('Add Project details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole("menuitem", 'Projects');
        let rowLength = await page.locator(timePage.cusomterRow('Demo Play Project')).count();
        for (let i = 0; i < rowLength; i++) {
            let row = await timePage.cusomterRow('Demo Play Project');
            let isCustomerAlreadyPresent = await page.locator(row).isVisible();
            if (isCustomerAlreadyPresent) {
                let matchedRow = await timePage.cusomterRow('Demo Play Project');
                await page.locator(matchedRow).locator("//i[@class='oxd-icon bi-trash']").click();
                await myInfoPage.page.waitForSelector(myInfoPage.attachments.confirmationPopup);
                await myInfoPage.page.locator(myInfoPage.attachments.popupDeleteButton).click();
                expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            }
        }

        await utils.click(performancePage.add);
        await utils.fillTextBoxValues(timePage.name, "Demo Play Project");
        await utils.clearTextBoxValues(timePage.projects.customerName);
        await utils.fillTextBoxValues(timePage.projects.customerName, "APlay Test");
        await utils.clickOption('option', "APlay Test Ltd");
        await utils.fillTextBoxValues(timePage.description, "An AI Project");
        await utils.clickSave(myInfoPage.save, 3);
        await utils.click(performancePage.add);
        await page.waitForSelector(".oxd-dialog-sheet");
        await utils.fillTextBoxValues(".oxd-dialog-sheet .oxd-input", "Aplay");
        await utils.clickSave(myInfoPage.save, 7, Constants.sucessMsg.sucessfulSavedMsg);

        await utils.clickSave(myInfoPage.save, 3, Constants.sucessMsg.successfulUpdatedMsg);
        await (await page.waitForSelector(timePage.projects.filterArea)).waitForElementState('stable');
        await utils.fillTextBoxValues(timePage.projects.customerName, "APlay Test Ltd");
        await utils.clickOption('option', "APlay Test Ltd");
        await utils.fillTextBoxValues(timePage.projects.project, "Demo Play Project");
        await utils.clickOption('option', "Demo Play Project");
        await utils.click(timePage.projects.search);
        let cellValues = await timePage.getARowByColumnText('APlay Test Ltd');
        expect(cellValues.companyName).toEqual('APlay Test Ltd');
    });
});

test.describe('Time Timesheets', () => {
    test('Add My Timesheets details', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole("menuitem", 'My Timesheets');
        await utils.waitForContainer();
        await utils.click(timePage.timesheets.editButton);
        await utils.fillTextBoxValues(timePage.timesheets.project, "APlay");
        await utils.clickOption('option', "APlay Test Ltd - Demo Play Project");
        await utils.selecDropdownOption("option", timePage.timesheets.activity, "Aplay");
        for (let i = 0; i < 5; i++) {
            let inputCell = page.locator(timePage.timesheets.timeInputCell).nth(i);
            console.log("inputCell", inputCell);
            await page.locator(timePage.timesheets.timeInputCell).nth(i).fill("09:00");
        }
        await utils.clickSave(myInfoPage.save, 2, Constants.sucessMsg.sucessfulSavedMsg);
        let total = await page.locator("//span[text()='APlay Test Ltd - Demo Play Project']/../..//td[contains(@class,'--freeze-right')]").textContent();
        expect(total).toEqual("45:00");
    });
});


test.describe('Time Attendance', () => {
    test('Add Punch In/Out details', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Punch In/Out');
        await utils.waitForContainer();
        await utils.fillDateValue(timePage.punchInOut.date, "2023-03-27");
        await utils.fillTextBoxValues(timePage.punchInOut.time, "10:00 AM");
        await utils.fillTextBoxValues(timePage.punchInOut.note, "Logged in");
        // await utils.click(timePage.punchInOut.in);
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await utils.fillDateValue(timePage.punchInOut.date, "2023-03-27");
        await utils.fillTextBoxValues(timePage.punchInOut.time, "07:00 PM");
        await utils.fillTextBoxValues(timePage.punchInOut.note, "Logged out");
        // await utils.click(timePage.punchInOut.in);
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });
});

test.describe('Time Reports', () => {
    test('Search and View project Reports', async () => {
        await utils.click(timePage.timeElements.reports);
        await utils.clickByRole("menuitem", 'Project Reports');
        await utils.waitForContainer();
        await utils.fillTextBoxValues(timePage.reports.project, "APlay");
        await utils.clickOption('option', "APlay Test Ltd - Demo Play Project");
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        expect(page.locator(".rgRow .cell-action").textContent()).toEqual("Aplay");
        expect(page.locator(".rgRow .col-alt").textContent()).toEqual("45.00");
    });
});