import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage, DirectoryPage, PerformancePage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, directoryPage: DirectoryPage, performancePage: PerformancePage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    // await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    myInfoPage = new MyInfoPage(page);
    directoryPage = new DirectoryPage(page);
    performancePage = new PerformancePage(page);
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

    await utils.createUsers("Test", "User2", "testuser2");
    await utils.updatingUserRole("testuser2", "Admin");

    await utils.createUsers("Test", "User3", "testuser3");
    await utils.updatingUserRole("testuser3", "Admin");

    await assignSupervisor("Test User1", "Test User2");

    await assignSupervisor("Test User2", "Test User3");

});

async function assignSupervisor(employeeToSearch, supervisorEmployee) {
    await utils.clickMenu("link", homePage.homePageElements.pim, "PIM");
    await utils.fillTextBoxValues(directoryPage.directory.employeeName, employeeToSearch);
    await utils.clickOption('option', employeeToSearch);
    await utils.click("[type='submit']");
    await utils.click(performancePage.addReview.editIcon);
    await utils.click("//a[text()='Report-to']");
    await utils.clickElementWithIndex("//button[text()=' Add ']", 0);
    await utils.fillTextBoxValues("//label[text()='Name']/../..//input", supervisorEmployee);
    await utils.clickOption('option', supervisorEmployee);
    await utils.click("//label[text()='Reporting Method']/../..//div[@class='oxd-select-text-input']");
    await utils.clickOption('option', "Direct");
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
}

test.afterAll(async () => {
    await page.close();
});


test.describe('Performance Configure', () => {
    test('Filling KPIs details', async () => {
        await utils.click(".oxd-userdropdown-tab");
        await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
        await loginPage.fillUsrNameAndPwdAndLogin("testuser1", "Testuser@12");
        await expect(page).toHaveURL(/.*dashboard/);
        await page.waitForSelector(homePage.homePageElements.dashboardGrid);
        await utils.clickMenu("link", homePage.homePageElements.performance, "Performance");

        await utils.click(performancePage.keyPerformanceIndicators.configure);
        await utils.clickByRole("menuitem", 'KPIs',true);
        let row = await performancePage.getARowCheckbox('A Playwright Test');
        await utils.click(performancePage.add);
        await utils.fillTextBoxValues(performancePage.keyPerformanceIndicators.keyPerformanceIndicator, "A Playwright Test");
        await utils.selecDropdownOption("option", performancePage.keyPerformanceIndicators.jobTitle, "Software Engineer");
        await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await utils.selecDropdownOption("option", performancePage.keyPerformanceIndicators.jobTitle, "Software Engineer");
        await utils.click(performancePage.keyPerformanceIndicators.search);
        await expect(row.nth(0)).toBeVisible();
    });
});

test('Filling Trackers details', async () => {
    await utils.click(performancePage.keyPerformanceIndicators.configure);
    await utils.clickByRole("menuitem", 'Trackers',true);
    await utils.click(performancePage.add);
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.trackerName, "AB Playwright Test");
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, "Test U");
    await utils.clickOption('option', "Test User1");
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.reviewers, "Test U");
    await utils.clickOption('option', "Test User2");
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, "Test U");
    await utils.clickOption('option', "Test User1");
    await utils.click(performancePage.keyPerformanceIndicators.search);
    let perfTracker = await performancePage.getARow('AB Playwright Test');
    let status = await perfTracker.first().isVisible();
    expect(status).toBeTruthy();
});

test.describe('Performance My tracker', () => {
    test('Viewing My Trackers details', async () => {
        await utils.clickByRole(Constants.Roles.link, 'My Trackers',true);
        let tracker = await performancePage.getARow('AB Playwright Test');
        expect(tracker).toBeVisible();
        let isMyTrackerOpened = await performancePage.clickViewAndVerify();
        expect(isMyTrackerOpened).toBeTruthy();
    });
});

test.describe('Performance Employee Tracker', () => {
    test('Viewing Employee Trackers details', async () => {
        await utils.clickByRole(Constants.Roles.link, 'Employee Trackers'),true;
        await utils.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, "Test  U");
        await utils.clickOption('option', "Test  User2");
        await utils.selecDropdownOption("option", performancePage.employeeTrackers.include, "Current Employees Only");
        await performancePage.getViewAndClick('AB Playwright Test', 0);
        let empPerfTrackerCharlie = await performancePage.isEmployeeTrackerViewVisible();
        expect(empPerfTrackerCharlie).toBeTruthy();
        await utils.click(performancePage.logElements.addLog);
        await performancePage.createLogs();
        expect(page.locator(performancePage.logElements.employeeTrackerLogContainer)).toBeVisible();
        await performancePage.deleteLogs();
        expect(performancePage.page.locator(performancePage.logElements.noRecords)).toBeVisible();
    });
});

test.describe('Performance Manage Reviews', () => {
    test('Deleting the existing Performance Reviews records', async () => {
        // await myInfoPage.clickMenu("link", homePage.homePage.performance, "Performance");
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole("menuitem", 'Manage Reviews',true);
        // await performancePage.deleteRecords("2023");
        expect(page.locator(performancePage.addReview.tableRow)).not.toBeVisible();
    });

    test('Adding the Manage Performance Review records', async () => {
        await utils.click(performancePage.add);
        await utils.fillTextBoxValues(performancePage.addReview.employeeName, "Test U")
        await utils.clickOption('option', "Test User1");
        await utils.fillTextBoxValues(performancePage.addReview.supervisorReviewer, "Test")
        await utils.clickOption('option', "Test User2");
        await utils.fillDateValue(performancePage.addReview.reviewPeriodStartDate, "2023-03-15");
        await utils.fillDateValue(performancePage.addReview.reviewPeriodEndDate, "2023-03-28");
        await utils.fillDateValue(performancePage.addReview.reviewDueDate, "2023-03-30");
        await utils.clickSave(myInfoPage.save, 1);
        let rowCells = await performancePage.getRowDetails();
        console.log("rowcells1", rowCells);
        expect(rowCells.reviewStatus).toEqual("Inactive");
    });

    test('Activating the Manage Performance Review record', async () => {
        await utils.clickElementWithIndex(performancePage.addReview.editIcon, 0);
        await utils.waitForContainer();
        await page.waitForTimeout(5000);
        await utils.click(performancePage.addReview.activate);
        let toast = await utils.getToastMessage();
        expect(toast).toEqual(Constants.sucessMsg.sucessfulActivatedMsg);
        await utils.click(myInfoPage.toastElements.closeIcon);
        await utils.waitForSpinnerToDisappear();
        let rowCells = await performancePage.getRowDetails();
        console.log("rowcells2", rowCells);
        expect(rowCells.reviewStatus).toEqual("Activated");
    });
});

test.describe('Performance My Reviews', () => {
    test('Viewing the My Reviews performance', async () => {
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole("menuitem", 'My Reviews',true);
        await page.waitForTimeout(5000);
        let dueDate = await page.locator("//div[text()='2023-03-30']").isVisible();
        console.log("dueDate", dueDate);
        expect(dueDate).toBeTruthy();
        await utils.clickElementWithIndex('.bi-file-text-fill', 0);
        for (let i = 0; i < 5; i++) {
            console.log("iteration", i);
            await page.locator('.orangehrm-evaluation-grid .oxd-input--active').nth(i).fill('90');
            await page.locator('.orangehrm-evaluation-grid .oxd-textarea--active').nth(i).fill('Good Performance');
        }
        await page.locator("//p[text()='General Comment']/../..//following::textarea").type("Overall good");
        await utils.clickElementWithIndex(performancePage.myReview.complete, 2);
        await utils.clickElementWithIndex(performancePage.myReview.popupButtons, 2);
        expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole("menuitem", 'My Reviews',true);
        await page.waitForTimeout(5000);
        let rowCells = await performancePage.getMyReviewDetails('2023-03-30');
        console.log("rowcells3", rowCells);
        expect(rowCells.selfEvaluationStatus).toEqual('Completed');
    });
});

test.describe('Performance Employee Reviews', () => {
    test('Viewing the Employee Reviews performance', async () => {
        await utils.click(".oxd-userdropdown-tab");
        await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
        await loginPage.fillUsrNameAndPwdAndLogin("testuser2", "Testuser@12");
        await expect(page).toHaveURL(/.*dashboard/);
        await page.waitForSelector(homePage.homePageElements.dashboardGrid);
        await utils.clickMenu("link", homePage.homePageElements.performance, "Performance");
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole("menuitem", 'Employee Reviews',true);
        await page.waitForTimeout(3000);
        await utils.fillTextBoxValues(performancePage.addReview.employeeName, "Test U")
        await utils.clickOption('option', "Test User1");
        await utils.click(directoryPage.directory.search);
        let rowCells = await performancePage.getMyReviewDetails('2023-03-30');
        console.log("rowcells4", rowCells);
    });
});