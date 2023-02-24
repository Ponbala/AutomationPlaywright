import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, CartPage, RegisterPage, CheckoutPage } from '../pageObjects';
import ENV from '../support/env';
import { Buffer } from 'buffer';
import fs from "fs";
// import terminalImage from 'terminal-image';

let loginPage: LoginPage, homePage: HomePage, cartPage: CartPage, registerPage: RegisterPage, checkoutPage: CheckoutPage, testData: TestData, page: Page, utils: Utils;

enum Products {
  firstItem = "1",
  secondItem = "2",
  thirdItem = "3"
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
  testData = new TestData(page);
});

test.beforeEach(async () => {
  await homePage.getBaseURL();
  await expect(page).toHaveTitle(Constants.TitleVerification.swagLabsTitle);
  let pass = await testData.encodeDecodePassword();
  await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Adding products and removing scenarios', () => {
  // test.afterEach(async () => {
  //   if (test.info().status === 'failed') {
      //1st way
      // const screenshot = await page.screenshot({ fullPage: true, type: 'png' });
      // const base64Text = screenshot.toString('base64');
      // const bufferScreenshot = Buffer.from(base64Text, 'base64');
      // console.log(await page.screenshot({fullPage: true, type: 'png'}));
      // await page.screenshot({fullPage: true, type: 'png'});
   
      //2nd way
      // await test.info().attach('screenshot', { body: Buffer.from(base64Text, 'base64'), contentType: 'image/png' });

      //3rd way
      // const file = test.info().outputPath('screenshot.png');
      // await fs.promises.writeFile(file, Buffer.from(file, 'base64'));
      // await test.info().attach('my screenshot', { path: file });

      // 4th way
   // const asciiArt = await terminalImage.buffer(bufferScreenshot, { width: '50%' });
      // console.log(`\n\nFailure Screenshot (${test.info().status}):\n\n${asciiArt}`);
  //   }
  // });

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

  Constants.SortingOptions.forEach(option => {
    test(`Sorting with ${option.sortOption}`, async () => {
      await homePage.clickSortDropdown();
      await homePage.sortAllOptionsAndVerify(option.optionKey, option.sortOption);
    });
  });
});