import { test, expect, Page } from '@playwright/test';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage, DirectoryPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, directoryPage: DirectoryPage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    // await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    myInfoPage = new MyInfoPage(page);
    directoryPage = new DirectoryPage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForSelector(homePage.homePage.dashboardGrid);
    await myInfoPage.clickMenu("link", homePage.homePage.directory, "Directory");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Directory', () => {
    test('Filling Directory details', async () => {
        await myInfoPage.fillTextBoxValues(directoryPage.directory.employeeName, "Charlie");
        await page.getByRole('option', { name: "Charlie Carter" }).getByText("Charlie Carter", { exact: true }).click();
        await myInfoPage.selecDropdownOption("option", directoryPage.directory.jobTitle, "QA Engineer");
        await myInfoPage.selecDropdownOption("option", directoryPage.directory.location, "New York Sales Office");
        await myInfoPage.click(directoryPage.directory.search);
        await utils.waitForSpinnerToDisappear();
        expect(await (await directoryPage.getRecordsCount()).trim()).toEqual('(1) Record Found');
        expect(await (await directoryPage.getEmployeeName()).trim()).toEqual('Charlie  Carter');
    });
});
