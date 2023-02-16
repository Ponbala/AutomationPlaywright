import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';

let loginPage: LoginPage, homePage: HomePage, cartPage: CartPage, registerPage: RegisterPage, checkoutPage: CheckoutPage, page: Page, utils: Utils;

const optionText = [Constants.SortOption.aToZ, Constants.SortOption.zToA, Constants.SortOption.lowToHigh, Constants.SortOption.highToLow];

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

const itemsToAddCount = Object.keys(Products).length;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  // utils = new Utils(page);
  // await utils.launchBrowsers();
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
    await expect(page).toHaveTitle(Constants.TitleVerification.swagLabsTitle);
    await loginPage.fillUsrNameAndPwdAndLogin(Constants.Credentials.stdUser, Constants.Credentials.password);
  });

  test('Adding the product to cart and placing the order with standard User', async () => {
    await homePage.clickAddToCart();
    expect(await homePage.getItemsCountInCart()).toEqual(Products.firstItem);
    await homePage.clickShoppingCartAndFillRegistrationValues();
    await checkoutPage.clickFinish();
    expect(await checkoutPage.getOrderSuccessMsg()).toEqual(Constants.ErrorMsg.orderSuccessMsg);
    await checkoutPage.clickBackToHomeAndLogout();
  });

  test('Adding the product to cart and removing from cart', async () => {
    await homePage.addItemsToCart(itemsToAddCount);
    expect(await homePage.getItemsCountInCart()).toEqual(itemsToAddCount.toString());
    await homePage.removeItemsFromCart(await homePage.getRemoveItemsCount());
    expect(await homePage.getItemsCountElement()).not.toBeVisible();
  });

  test('Sorting the products and asserting', async () => {
    await homePage.clickSortDropdown();
    await homePage.sortAllOptions(Object.values(sortOption), optionText);
  });
});