import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { Constants } from '../support/constants';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';

let loginPage: LoginPage, homePage: HomePage, cartPage: CartPage, registerPage: RegisterPage, checkoutPage: CheckoutPage;
let page: Page, browser: any, context: BrowserContext;

test.beforeAll(async ({ browser }) => {
    console.log('Before tests');
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    registerPage = new RegisterPage(page);
    checkoutPage = new CheckoutPage(page);
});

test.describe('Login users with wrong username and password scenarios', () => {
    test('Login with wrong username scenario', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
        let getUserNameEle = await loginPage.getUserNameElement();
        await page.locator(getUserNameEle).fill(Constants.wrongUsername);
        await page.locator(await loginPage.getPasswordElement()).fill(Constants.password);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.wrongUsernameOrPwdErrorMsg);
    });

    test('Login with wrong password scenario', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
        let getUserNameEle = await loginPage.getUserNameElement();
        await page.locator(getUserNameEle).fill(Constants.stdUser);
        await page.locator(await loginPage.getPasswordElement()).fill(Constants.wrongPassword);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.wrongUsernameOrPwdErrorMsg)
    });

    test('Login with wrong username and Password scenario', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
        let getUserNameEle = await loginPage.getUserNameElement();
        await page.locator(getUserNameEle).fill(Constants.wrongUsername);
        await page.locator(await loginPage.getPasswordElement()).fill(Constants.wrongPassword);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.wrongUsernameOrPwdErrorMsg)
    });
});

test.describe('Login users with different users', () => {
    test('Login with locked user and assert the error message', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
        let getUserNameEle = await loginPage.getUserNameElement();
        await page.locator(getUserNameEle).fill(Constants.lockedOutUser);
        await page.locator(await loginPage.getPasswordElement()).fill(Constants.password);
        await loginPage.clickLogin();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.lockedUserErrorMsg);
    });

    test('Login with problem user and assert the error message', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
        let getUserNameEle = await loginPage.getUserNameElement();
        await page.locator(getUserNameEle).fill(Constants.problemUser);
        await page.locator(await loginPage.getPasswordElement()).fill(Constants.password);
        await loginPage.clickLogin();
        await homePage.clickAddToCart(1);
        await homePage.clickShoppingCart();
        expect(page.locator(cartPage.cartContainer)).toBeVisible();
        await cartPage.clickCheckout();
        await page.locator(registerPage.firstName).fill(Constants.stdUser);
        await page.locator(registerPage.lastName).fill(Constants.stdUser);
        await page.locator(registerPage.postalCode).fill(Constants.postalCode);
        await registerPage.clickContinue();
        expect(await loginPage.getErrorMsg()).toEqual(Constants.lastNameErrorMsg);
        await loginPage.clickMenu();
        await loginPage.clickLogout();
        expect(page.locator(loginPage.loginContainer)).toBeVisible();
    });

    test('Login with performance glitch user and validate', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(Constants.swagLabsTitle);
        let getUserNameEle = await loginPage.getUserNameElement();
        await page.locator(getUserNameEle).fill(Constants.perfGlitchUser);
        await page.locator(await loginPage.getPasswordElement()).fill(Constants.password);
        await loginPage.clickLogin();
        await homePage.clickAddToCart(1);
        await homePage.clickShoppingCart();
        expect(page.locator(cartPage.cartContainer)).toBeVisible();
        await cartPage.clickCheckout();
        await page.locator(registerPage.firstName).fill(Constants.stdUser);
        await page.locator(registerPage.lastName).fill(Constants.stdUser);
        await page.locator(registerPage.postalCode).fill(Constants.postalCode);
        await registerPage.clickContinue();
        expect(page.locator(checkoutPage.finish)).toBeVisible();
        await checkoutPage.clickFinish();
        expect(await checkoutPage.getOrderSuccessMsg()).toEqual(Constants.orderSuccessMsg);
        await checkoutPage.clickBackToHome();
        let product = await loginPage.getTitleText();
        expect(product).toEqual(Constants.products);
        await loginPage.clickMenu();
        await loginPage.clickLogout();
        expect(page.locator(loginPage.loginContainer)).toBeVisible();
    });
});