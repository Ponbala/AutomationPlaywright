import { test, expect, Page } from '@playwright/test';
import { Utils } from '../support/utils';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';
import { Credentials, TitleVerification, ErrorMsg } from '../support/constants.json';

let loginPage: LoginPage, homePage: HomePage, cartPage: CartPage, registerPage: RegisterPage, checkoutPage: CheckoutPage, page: Page, utils: Utils;

enum Products {
    firstItem = "1",
    secondItem = "2",
    thirdItem = "3"
}

const itemsToAddCount = Object.keys(Products).length;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    registerPage = new RegisterPage(page);
    checkoutPage = new CheckoutPage(page);
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Login users with wrong username and password scenarios', () => {
    test.beforeEach(async () => {
        await homePage.getBaseURL();
        await expect(page).toHaveTitle(TitleVerification.swagLabsTitle);
    });

    test('Login with wrong username scenario', async () => {
        await loginPage.fillUsrNameAndPwdAndLogin(Credentials.wrongUsername, Credentials.password);
        expect(await loginPage.getErrorMsg()).toEqual(ErrorMsg.wrongUsernameOrPwdErrorMsg);
    });

    test('Login with wrong password scenario', async () => {
        await loginPage.fillUsrNameAndPwdAndLogin(Credentials.stdUser, Credentials.wrongPassword);
        expect(await loginPage.getErrorMsg()).toEqual(ErrorMsg.wrongUsernameOrPwdErrorMsg)
    });

    test('Login with wrong username and Password scenario', async () => {
        await loginPage.fillUsrNameAndPwdAndLogin(Credentials.wrongUsername, Credentials.wrongPassword);
        expect(await loginPage.getErrorMsg()).toEqual(ErrorMsg.wrongUsernameOrPwdErrorMsg)
    });

    test('Login with locked user and assert the error message', async () => {
        await loginPage.fillUsrNameAndPwdAndLogin(Credentials.lockedOutUser, Credentials.password);
        expect(await loginPage.getErrorMsg()).toEqual(ErrorMsg.lockedUserErrorMsg);
    });

    test('Login with problem user and assert the error message', async () => {
        await loginPage.fillUsrNameAndPwdAndLogin(Credentials.problemUser, Credentials.password);
        await homePage.addItemsToCart(itemsToAddCount);
        await homePage.clickShoppingCartAndFillRegistrationValues();
        expect(await loginPage.getErrorMsg()).toEqual(ErrorMsg.lastNameErrorMsg);
        await loginPage.logout();
        expect(page.locator(loginPage.loginContainer)).toBeVisible();
    });

    test('Login with performance glitch user and place the order', async () => {
        await loginPage.fillUsrNameAndPwdAndLogin(Credentials.perfGlitchUser, Credentials.password);
        await homePage.addItemsToCart(itemsToAddCount);
        await homePage.clickShoppingCartAndFillRegistrationValues();
        await checkoutPage.clickFinish();
        expect(await checkoutPage.getOrderSuccessMsg()).toEqual(ErrorMsg.orderSuccessMsg);
        await checkoutPage.clickBackToHomeAndLogout();
    });
});