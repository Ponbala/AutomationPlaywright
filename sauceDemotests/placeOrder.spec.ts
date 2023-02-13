import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { Constants } from '../support/constants';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';
// import defineConfig from '../playwright.config';

let loginPage: LoginPage, homePage:HomePage, cartPage:CartPage, registerPage:RegisterPage, checkoutPage:CheckoutPage;
let page: Page, browser: any, context: BrowserContext;

test.beforeAll(async ({browser}) => {
  console.log('Before tests');
  // browser = await chromium.launch({ headless: false });
  // context = await browser.newContext();
  // page = await context.newPage();
  page = await browser.newPage();
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  cartPage = new CartPage(page);
});

test.afterAll(async () => {
  console.log('After tests');
  await page.close();
});

test('Adding the product to cart and placing the order with standard User', async () => {
  await page.goto('/');
  await expect(page).toHaveTitle(Constants.swagLabsTitle);
  let getUserNameEle = await loginPage.getUserNameElement();
  await page.locator(getUserNameEle).fill(Constants.stdUser);
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

// await checkoutPage.clickCancel();
// test('get started link', async ({ page }) => {
  // await page.goto('https://playwright.dev/');
  // Click the get started link.
  // await page.getByRole('link', { name: 'Get started' }).click();
  // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/);
// });
