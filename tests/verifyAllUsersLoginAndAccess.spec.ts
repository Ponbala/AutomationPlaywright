import { test, expect, Page } from '@playwright/test';
import { Constants } from '../support/constants';
import { Utils } from '../support/utils';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';

let loginPage: LoginPage, homePage: HomePage, cartPage: CartPage, registerPage: RegisterPage, checkoutPage: CheckoutPage, page: Page, utils: Utils;

enum Products {
    firstItem = "1",
    secondItem = "2",
    thirdItem = "3"
}

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
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
    });

    test('Login with wrong username scenario', async () => {
        await loginPage.fillUsrNameAndPwd(Constants.wrongUsername, Constants.password);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.wrongUsernameOrPwdErrorMsg);
    });

    test('Login with wrong password scenario', async () => {
        await loginPage.fillUsrNameAndPwd(Constants.stdUser, Constants.wrongPassword);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.wrongUsernameOrPwdErrorMsg)
    });

    test('Login with wrong username and Password scenario', async () => {
        await loginPage.fillUsrNameAndPwd(Constants.wrongUsername, Constants.wrongPassword);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.wrongUsernameOrPwdErrorMsg)
    });

    test('Login with locked user and assert the error message', async () => {
        await loginPage.fillUsrNameAndPwd(Constants.lockedOutUser, Constants.password);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.lockedUserErrorMsg);
    });

    test('Login with problem user and assert the error message', async () => {
        await loginPage.fillUsrNameAndPwd(Constants.problemUser, Constants.password);
        await loginPage.clickLogin();
        const itemsToAddCount = Object.keys(Products).length;
        await homePage.addItemsToCart(itemsToAddCount);
        await homePage.clickShoppingCart();
        expect(page.locator(cartPage.cartContainer)).toBeVisible();
        await cartPage.clickCheckout();
        await registerPage.fillRegistrationFieldValues(Constants.stdUser, Constants.postalCode);
        await registerPage.clickContinue();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.lastNameErrorMsg);
        await loginPage.logout();
        expect(page.locator(loginPage.loginContainer)).toBeVisible();
    });

    test('Login with performance glitch user and place the order', async () => {
        await loginPage.fillUsrNameAndPwd(Constants.perfGlitchUser, Constants.password);
        await loginPage.clickLogin();
        const itemsToAddCount = Object.keys(Products).length;
        await homePage.addItemsToCart(itemsToAddCount);
        await homePage.clickShoppingCart();
        expect(page.locator(cartPage.cartContainer)).toBeVisible();
        await cartPage.clickCheckout();
        await registerPage.fillRegistrationFieldValues(Constants.stdUser, Constants.postalCode);
        await registerPage.clickContinue();
        await checkoutPage.clickFinish();
        expect(await checkoutPage.getOrderSuccessMsg()).toEqual(Constants.orderSuccessMsg);
        await checkoutPage.clickBackToHome();
        const productPageTitle = await loginPage.getTitleText();
        expect(productPageTitle).toEqual(Constants.productsPageTitle);
        await loginPage.logout();
        expect(page.locator(loginPage.loginContainer)).toBeVisible();
    });
});