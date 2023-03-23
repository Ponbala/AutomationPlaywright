import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage, DirectoryPage, PerformancePage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, directoryPage: DirectoryPage, performancePage: PerformancePage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // utils = new Utils(page);
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
    await page.waitForSelector(homePage.homePage.dashboardGrid);
    await myInfoPage.clickMenu("link", homePage.homePage.directory, "Performance");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Performance', () => {
    test('Filling KPIs details', async () => {
        await myInfoPage.click(performancePage.keyPerformanceIndicators.configure);
        await performancePage.clickByRole("menuitem", 'KPIs');
        let row = await performancePage.getARowCheckbox('A Playwright Test');
        await myInfoPage.click(performancePage.keyPerformanceIndicators.add);
        await myInfoPage.fillTextBoxValues(performancePage.keyPerformanceIndicators.keyPerformanceIndicator, "A Playwright Test");
        await myInfoPage.selecDropdownOption("option", performancePage.keyPerformanceIndicators.jobTitle, "Software Engineer");
        await myInfoPage.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await myInfoPage.selecDropdownOption("option", performancePage.keyPerformanceIndicators.jobTitle, "Software Engineer");
        await myInfoPage.click(performancePage.keyPerformanceIndicators.search);
        await expect(row.nth(0)).toBeVisible();
    });

    test('Filling Trackers details', async () => {
        await myInfoPage.click(performancePage.keyPerformanceIndicators.configure);
        await performancePage.clickByRole("menuitem", 'Trackers');
        await myInfoPage.click(performancePage.keyPerformanceIndicators.add);
        await myInfoPage.fillTextBoxValues(performancePage.addPerformanceTracker.trackerName, "AB Playwright Test");
        await myInfoPage.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, "Charlie");
        await performancePage.clickOption('option', "Charlie Carter");
        await myInfoPage.fillTextBoxValues(performancePage.addPerformanceTracker.reviewers, "Lisa");
        await performancePage.clickOption('option', "Lisa Andrews");
        await myInfoPage.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await myInfoPage.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, "Charlie");
        await performancePage.clickOption('option', "Charlie Carter");
        await myInfoPage.click(performancePage.keyPerformanceIndicators.search);
        let perfTracker = await performancePage.getARow('AB Playwright Test');
        let status = await perfTracker.first().isVisible();
        expect(status).toBeTruthy();
    });

    test('Viewing My Trackers details', async () => {
        await performancePage.clickByRole(Constants.Roles.link, 'My Trackers');
        let tracker = await performancePage.getARow('Tracker for paul');
        expect(tracker).toBeVisible();
        let isMyTrackerOpened = await performancePage.clickViewAndVerify();
        expect(isMyTrackerOpened).toBeTruthy();
    });

    test('Viewing Employee Trackers details', async () => {
        await performancePage.clickByRole(Constants.Roles.link, 'Employee Trackers');
        await myInfoPage.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, "Charlie");
        await performancePage.clickOption('option', "Charlie Carter");
        await myInfoPage.selecDropdownOption("option", performancePage.employeeTrackers.include, "Current Employees Only");
        await performancePage.getViewAndClick('AB Playwright Test',0);
        let empPerfTrackerCharlie = await performancePage.isEmployeeTrackerViewVisible();
        expect(empPerfTrackerCharlie).toBeTruthy();
        await myInfoPage.click(performancePage.logElements.addLog);
        await performancePage.createLogs();
        expect(page.locator(performancePage.logElements.employeeTrackerLogContainer)).toBeVisible();
        await performancePage.deleteLogs();
        expect(performancePage.page.locator(performancePage.logElements.noRecords)).toBeVisible();
    });
});