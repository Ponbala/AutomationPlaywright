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
    await utils.deleteUsers();
    await utils.createUsers("Test", "User1", "testuser1");
    await utils.updatingUserRole("testuser1", "Admin");
    await utils.logout();
    await loginPage.fillUsrNameAndPwdAndLogin("testuser1", "Testuser@12");
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForSelector(homePage.homePageElements.dashboardGrid);
    await utils.clickMenu("link", homePage.homePageElements.time, "Time");
});


test.afterAll(async () => {
    await page.close();
});

test.describe('Time Project Info', () => {
    test('Add Customer details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole("menuitem", 'Customers', true);
        await page.waitForTimeout(4000);
        let isCustomerPresent = await utils.isElementVisible(await timePage.cusomterRow("APlay Test Ltd"));
        console.log("isCustomerPresent", isCustomerPresent);
        if (!isCustomerPresent) {
            await utils.click(performancePage.add);
            await utils.fillTextBoxValues(timePage.name, "APlay Test Ltd");
            await utils.fillTextBoxValues(timePage.description, "An AI Company");
            await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
            let cellValues = await timePage.getARowByColumnText("APlay Test Ltd");
            expect(cellValues.companyName).toEqual("APlay Test Ltd");
        }
    });

    test('Add Project details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole("menuitem", 'Projects', true);
        await page.waitForTimeout(4000);
        let isProjectPresent = await utils.isElementVisible(await timePage.cusomterRow("Demo Play Project"));
        console.log("isProjectPresent", isProjectPresent);
        if (!isProjectPresent) {
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
        }
    });
});

test.describe('Time Timesheets', () => {
    test('Add My Timesheets details', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole("menuitem", 'My Timesheets', true);
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
        await page.waitForSelector(timePage.timesheets.totalhrs);
        let total = await utils.getText(timePage.timesheets.totalhrs);
        expect(total).toEqual("45:00");
        await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSubmittedMsg);
        let actionsTableCells = await timePage.getTimesheetActionTable("Test User1");
        console.log("actions", actionsTableCells);
        expect(await actionsTableCells.actions).toEqual("Submitted");
    });

    test('Retrieve Employee Timesheets', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole("menuitem", 'Employee Timesheets', true);
        await utils.waitForContainer();

        await utils.fillTextBoxValues(timePage.timeElements.employeeName, "Test");
        await utils.clickOption('option', "Test User1");
        await utils.click(timePage.timeElements.view);
        await (await page.waitForSelector(timePage.timeElements.tableContainer)).waitForElementState("stable");

        let actionsTableCells = await timePage.getTimesheetActionTable("Test User1");
        console.log("actions", actionsTableCells);
        expect(await actionsTableCells.actions).toEqual("Submitted");
    });
});

test.describe('Time Attendance', () => {
    test('Add Punch In/Out details', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Punch In/Out', true);
        await utils.waitForContainer();
        await page.waitForTimeout(4000);
        await utils.fillDateValue(timePage.timeElements.date, "2023-03-27");
        await utils.clearTextBoxValues(timePage.punchInOut.time);
        await utils.fillTextBoxValues(timePage.punchInOut.time, "10:00 AM");
        await utils.click(timePage.punchInOut.note);
        await utils.fillTextBoxValues(timePage.punchInOut.note, "Logged in");
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        // await page.waitForTimeout(4000);
        await utils.fillDateValue(timePage.timeElements.date, "2023-03-27");
        await utils.clearTextBoxValues(timePage.punchInOut.time);
        await utils.fillTextBoxValues(timePage.punchInOut.time, "07:00 PM");
        await utils.click(timePage.punchInOut.note);
        await utils.fillTextBoxValues(timePage.punchInOut.note, "Logged out");
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('View My Records', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'My Records', false);
        await page.waitForTimeout(3000);
        await utils.fillDateValue(timePage.timeElements.date, "2023-03-27");
        await utils.click(timePage.timeElements.view);
        await (await page.waitForSelector(timePage.timeElements.tableContainer)).waitForElementState("stable");
        // await page.waitForTimeout(3000);
        let tableCells = await timePage.getAttendanceRowCells("Logged in");
        console.log("actions", tableCells);
        expect(tableCells.duration).toEqual("9.00");
    });

    test('View Employee Records', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Employee Records', false);
        await utils.fillDateValue(timePage.timeElements.employeeName, "Test");
        await utils.clickOption('option', "Test User1");
        await utils.fillDateValue(timePage.timeElements.date, "2023-03-27");
        await utils.click(timePage.timeElements.view);
        await page.waitForSelector(timePage.reports.reportsTableContainer);
        let tableCells = await timePage.getAttendanceRowCells("Logged in");
        console.log("actions", tableCells);
        expect(tableCells.duration).toEqual("9.00");
    });

    test('Enable/Disable access from Configuration sub menu', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Configuration', true);
        await utils.clickElementWithIndex(timePage.attendance.switch, 1);
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'My Records', false);
        let tableRow = await utils.isElementVisible(timePage.attendance.deleteIcon);
        expect(tableRow).toBeFalsy();
    });
});

test.describe('Time Reports', () => {
    test('Search and View project Reports', async () => {
        await utils.click(timePage.timeElements.reports);
        await utils.clickByRole("menuitem", 'Project Reports', true);
        await utils.waitForContainer();
        await utils.fillTextBoxValues(timePage.reports.project, "APlay");
        await utils.clickOption('option', "APlay Test Ltd - Demo Play Project");
        await utils.click(timePage.timeElements.view);
        await page.waitForSelector(timePage.reports.reportsTableContainer);
        expect(await page.locator(".rgRow .cell-action").textContent()).toEqual("Aplay");
        // expect(await page.locator(".rgRow .col-alt").textContent()).toEqual("135.00");
    });

    test('Search and View Employee Reports', async () => {
        await utils.click(timePage.timeElements.reports);
        await utils.clickByRole("menuitem", 'Employee Reports', true);
        await utils.waitForContainer();
        await utils.fillTextBoxValues(timePage.timeElements.employeeName, "Test");
        await utils.clickOption('option', "Test User1");
        await utils.click(timePage.timeElements.view);
        await page.waitForSelector(timePage.reports.reportsTableContainer);
        await utils.isElementVisible(timePage.reports.employeeReportsTable);
        await utils.click(timePage.reports.maximize);
        let minimizeIcon = await page.locator(timePage.reports.minimize).getAttribute("class");
        expect(minimizeIcon.includes(Constants.others.minimizeIconClass)).toBeTruthy();

        await utils.click(timePage.reports.minimize);
        let maximizeIcon = await page.locator(timePage.reports.maximize).getAttribute("class");
        expect(maximizeIcon.includes(Constants.others.maximizeIconClass)).toBeTruthy();
    });

    test('Search and View Employee Attendance Summary', async () => {
        await utils.click(timePage.timeElements.reports);
        await utils.clickByRole("menuitem", 'Attendance Summary', true);
        await utils.waitForContainer();
        await utils.fillTextBoxValues(timePage.timeElements.employeeName, "Test");
        await utils.clickOption('option', "Test User1");
        await utils.click(timePage.timeElements.view);
        await page.waitForSelector(timePage.reports.reportsTableContainer);
        let visible = await utils.isElementVisible(timePage.reports.employeeReportsTable);
        console.log("visible", visible);
        let hours = await utils.getText(timePage.reports.totalDurationHours);
        console.log("totalHours", hours);
        expect(hours).toEqual("9.00");
    });
});