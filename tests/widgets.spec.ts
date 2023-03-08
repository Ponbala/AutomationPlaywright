import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { WidgetPage } from '../pageObjects';

let widgetPage: WidgetPage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  // utils = new Utils(page);
  // await utils.launchBrowsers();
  widgetPage = new WidgetPage(page);
  testData = new TestData(page);
  await widgetPage.getBaseURL();
  await widgetPage.clickElement(widgetPage.card, 3);
  await page.waitForSelector(widgetPage.accordianContainer);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Widgets', () => {
  test('Accordian test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.accordian);
    await widgetPage.clickElementForText(Constants.sections.section1);
    await widgetPage.collapseAndExpand(Constants.sections.section1, widgetPage.sectionHeading1, Constants.collapse.collapseShow, Constants.collapse.collapseHide);
    await widgetPage.collapseAndExpand(Constants.sections.section2, widgetPage.sectionHeading2, Constants.collapse.collapseShow, Constants.collapse.collapseHide);
    await widgetPage.collapseAndExpand(Constants.sections.section3, widgetPage.sectionHeading3, Constants.collapse.collapseShow, Constants.collapse.collapseHide);
  });

  test('Auto Complete test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.autoComplete, widgetPage.autoCompleteContainer);
    await widgetPage.selectOption(Constants.roles.textBoxRole, 0, Constants.colours.blue, true);
    await widgetPage.selectOption(Constants.roles.textBoxRole, 0, Constants.colours.black);
    expect(await widgetPage.getSelectedValues(widgetPage.multiSelectValues, true)).toEqual(Constants.colours.blueAndBlack);
    await widgetPage.selectOption(Constants.roles.textBoxRole, 1, Constants.colours.blue);
    expect(await widgetPage.getSelectedValues(widgetPage.singleSelectValue)).toEqual(Constants.colours.blue);
  });
});