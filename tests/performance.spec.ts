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
    await page.waitForSelector(homePage.dashboardGrid);
    await homePage.clickMenu(homePage.directory, "link", "Performance");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Performance', () => {
    test('Filling KPIs details', async () => {
        await myInfoPage.click(performancePage.configure);
        await performancePage.clickByRole("menuitem", 'KPIs');
        let row = await performancePage.getARowCheckbox('A Playwright Test');
        await myInfoPage.click(performancePage.add);
        await myInfoPage.fillTextBoxValues(performancePage.keyPerformanceIndicator, "A Playwright Test");
        await myInfoPage.selecDropdownOptionWithRole(performancePage.jobTitle, "Software Engineer");
        await myInfoPage.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await myInfoPage.selecDropdownOptionWithRole(performancePage.jobTitle, "Software Engineer");
        await myInfoPage.click(performancePage.search);
        await expect(row.nth(0)).toBeVisible();
    });

    test('Filling Trackers details', async () => {
        await myInfoPage.click(performancePage.configure);
        await performancePage.clickByRole("menuitem", 'Trackers');
        await myInfoPage.click(performancePage.add);
        await myInfoPage.fillTextBoxValues(performancePage.trackerName, "AB Playwright Test");
        await myInfoPage.fillTextBoxValues(performancePage.employeeName, "Charlie");
        await performancePage.clickOption('option', "Charlie Carter");
        await myInfoPage.fillTextBoxValues(performancePage.reviewers, "Lisa");
        await performancePage.clickOption('option', "Lisa Andrews");
        await myInfoPage.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await myInfoPage.fillTextBoxValues(performancePage.employeeName, "Charlie");
        await performancePage.clickOption('option', "Charlie Carter");
        await myInfoPage.click(performancePage.search);
        await page.waitForTimeout(2000);
        let perfTracker = await performancePage.getARow('AB Playwright Test');
        let status = await perfTracker.first().isVisible();
        expect(status).toBeTruthy();
    });

    // test('Viewing My Trackers details', async () => {
    //     await performancePage.clickByRole(Constants.Roles.link, 'My Trackers');
    //     let tracker = await performancePage.getARow('Tracker for paul');
    //     await page.waitForTimeout(3000);
    //     expect(tracker).toBeVisible();
    //     let isMyTrackerOpened = await performancePage.clickViewAndVerify();
    //     expect(isMyTrackerOpened).toBeTruthy();
    // });

    test('Viewing Employee Trackers details', async () => {
        await performancePage.clickByRole(Constants.Roles.link, 'Employee Trackers');
        await myInfoPage.fillTextBoxValues(performancePage.employeeName, "Charlie");
        await performancePage.clickOption('option', "Charlie Carter");
        await myInfoPage.selecDropdownOptionWithRole(performancePage.include, "Current Employees Only");
        // let empPerfTracker = await performancePage.getARow('AB Playwright Test');
        // console.log("empPerfTracker",empPerfTracker);
        // let empPerfTrackerView = await empPerfTracker.locator("../..//button");
        let empPerfTracker = page.locator("//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'AB Playwright Test')]/../..//button[@name='view']");
        await empPerfTracker.nth(0).click();
        await page.waitForTimeout(6000);
        await (await page.waitForSelector(performancePage.employeeTrackerView)).waitForElementState("stable");
        let empPerfTrackerCharlie = await page.locator(performancePage.employeeTrackerView).isVisible();
        expect(empPerfTrackerCharlie).toBeTruthy();
        await myInfoPage.click(performancePage.addLog);
        await page.waitForSelector(performancePage.logPopup);
        await myInfoPage.fillTextBoxValues(performancePage.log, "AB pw test");
        await myInfoPage.clickElementWithIndex(performancePage.positive, 0);
        await myInfoPage.fillTextBoxValues(performancePage.comment, "Filled Logs");
        await myInfoPage.clickSave(performancePage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        expect(page.locator(performancePage.employeeTrackerLogContainer)).toBeVisible();
        await myInfoPage.click(performancePage.verticalDots);
        await myInfoPage.click(performancePage.delete);
        await page.waitForSelector(myInfoPage.confirmationPopup);
        await page.locator(myInfoPage.popupDeleteButton).click();
        expect(await myInfoPage.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await page.waitForTimeout(3000);
        expect(page.locator(performancePage.noRecords)).toBeVisible();
    });
});