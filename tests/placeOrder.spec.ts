import { test, expect, Page } from '@playwright/test';
import { Constants } from '../support/constants';
import { Utils } from '../support/utils';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';

let loginPage: LoginPage, homePage: HomePage, cartPage: CartPage, registerPage: RegisterPage, checkoutPage: CheckoutPage, page: Page, utils: Utils;

const optionText = [Constants.aToZ, Constants.zToA, Constants.lowToHigh, Constants.highToLow];

enum Products {
  firstItem = "1",
  secondItem = "2",
  thirdItem = "3"
}

enum sortOption {
  AtoZ = "az",
  ZtoA = "za",
  LowToHigh = "lohi",
  HighToLow = "hilo"
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

test.describe('Adding products and removing scenarios', () => {
  test.beforeEach(async () => {
    await homePage.getBaseURL();
    await expect(page).toHaveTitle(Constants.swagLabsTitle);
  });

  test('Adding the product to cart and placing the order with standard User', async () => {
    await loginPage.fillUsrNameAndPwd(Constants.stdUser, Constants.password);
    await loginPage.clickLogin();
    await homePage.clickAddToCart();
    expect(await homePage.getItemsCountInCart()).toEqual(Products.firstItem);
    await homePage.clickShoppingCart();
    expect(page.locator(cartPage.cartContainer)).toBeVisible();
    await cartPage.clickCheckout();
    await registerPage.fillRegistrationFieldValues(Constants.stdUser, Constants.postalCode);
    await registerPage.clickContinue();
    await checkoutPage.clickFinish();
    expect(await checkoutPage.getOrderSuccessMsg()).toEqual(Constants.orderSuccessMsg);
    await checkoutPage.clickBackToHome();
    let product = await loginPage.getTitleText();
    expect(product).toEqual(Constants.productsPageTitle);
    await loginPage.logout();
    expect(page.locator(loginPage.loginContainer)).toBeVisible();
  });

  test('Adding the product to cart and removing from cart', async () => {
    await loginPage.fillUsrNameAndPwd(Constants.stdUser, Constants.password);
    await loginPage.clickLogin();
    const itemsToAddCount = Object.keys(Products).length;
    await homePage.addItemsToCart(itemsToAddCount);
    let itemsInCart = await homePage.getItemsCountInCart();
    expect(itemsInCart).toEqual(itemsToAddCount.toString());
    const removeCount = await homePage.getRemoveItemsCount();
    await homePage.removeItemsFromCart(removeCount);
    expect(await homePage.getItemsCountElement()).not.toBeVisible();
  });

  test('Sorting the products and asserting', async () => {
    await loginPage.fillUsrNameAndPwd(Constants.stdUser, Constants.password);
    await loginPage.clickLogin();
    await homePage.clickSortDropdown();
    for (const option of Object.values(sortOption)) {
      const index = Object.values(sortOption).indexOf(option);
      const sortedOption = await homePage.selectSortOption(option);
      expect(sortedOption).toEqual(optionText[index]);
    }
  });
});