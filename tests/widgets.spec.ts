import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { WidgetPage } from '../pageObjects';

let widgetPage: WidgetPage, testData: TestData, page: Page, utils: Utils;
let multiselectDropdownLocators = [];

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  utils = new Utils(page);
  // await utils.launchBrowsers();
  widgetPage = new WidgetPage(page);
  multiselectDropdownLocators = [widgetPage.greenOption, widgetPage.blueOption, widgetPage.blackOption, widgetPage.redOption];
  testData = new TestData(page);
  await widgetPage.getBaseURL();
  await widgetPage.clickElementWithIndex(widgetPage.card, 3);
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

  test('Date Picker test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.datePicker, widgetPage.dataPickerContainer);
    let monthYearValue = await widgetPage.selectDateAndGetValue(widgetPage.monthYearInput, 0, Constants.months.december, Constants.days[25], Constants.time['10:45'], Constants.roles.listItemRole, false, Constants.years[2023]);
    expect(monthYearValue).toEqual(Constants.textValues.selectedDate);
    let monthYearTimeValue = await widgetPage.selectDateAndGetValue(widgetPage.monthYearTimeInput, 0, Constants.textValues.previousMonth, Constants.days[7], Constants.time['10:45'], Constants.roles.listItemRole, true);
    expect(monthYearTimeValue).toEqual(Constants.textValues.selectedDateTime);
  });

  test('Tabs test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.tabs, widgetPage.tabsContainer);
    expect(page.locator(widgetPage.whatTab)).toHaveAttribute(Constants.attribute.ariaSelected, Constants.bool.true);
    expect(await widgetPage.getOriginTab()).toHaveAttribute(Constants.attribute.ariaSelected, Constants.bool.false);
    await (await widgetPage.getOriginTab()).click();
    expect(await widgetPage.getOriginTab()).toHaveAttribute(Constants.attribute.ariaSelected, Constants.bool.true);
    expect(await widgetPage.getUseTab()).toHaveAttribute(Constants.attribute.ariaSelected, Constants.bool.false);
    await (await widgetPage.getUseTab()).click();
    expect(await widgetPage.getUseTab()).toHaveAttribute(Constants.attribute.ariaSelected, Constants.bool.true);
    expect(await widgetPage.getMoreTab()).toHaveAttribute(Constants.attribute.ariaSelected, Constants.bool.false);
    let isDisabled = await (await widgetPage.getMoreTab()).getAttribute(Constants.attribute.class);
    expect(isDisabled).toContain(Constants.textValues.disabled);
  });

  test('Tooltip test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.toolTips, widgetPage.tooltipContainer);
    let locators = [widgetPage.tooltipButton, widgetPage.tooltipFieldContainer, widgetPage.tooltipContrary, widgetPage.tooltipDate];
    let tooltipValues = [Constants.hoverText.button, Constants.hoverText.field, Constants.hoverText.contrary, Constants.hoverText.date];
    await widgetPage.hoverAllElements(locators, tooltipValues);
  });

  test('Tooltip test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.menu, widgetPage.menuContainer);
    await widgetPage.hoverElement(widgetPage.mainItem2);
    expect(await widgetPage.getSubItem()).toBeVisible();
    await widgetPage.hoverElement(widgetPage.subSubList);
    expect(await widgetPage.getElement(widgetPage.subSubItem1)).toBeVisible();
    expect(await widgetPage.getElement(widgetPage.subSubItem2)).toBeVisible();
  });

  test('Select Menu test', async () => {
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.selectMenu, widgetPage.selectMenuContainer);
    await widgetPage.clickElement(widgetPage.selectValues);
    await widgetPage.clickElementForText(Constants.textValues.groupOption);
    await widgetPage.clickElement(widgetPage.selectOneMenu);
    await widgetPage.clickElementForText(Constants.textValues.mr);
    await widgetPage.selectOptionForDropdown(widgetPage.selectOldMenu, Constants.colours.blue);
    await widgetPage.clickElementForText(Constants.textValues.select);
    await widgetPage.selectAllElements(multiselectDropdownLocators);
    await widgetPage.keyboardPress(Constants.textValues.control);
    await widgetPage.selectOptionForDropdown(widgetPage.multiselect, Constants.options.saabAndOpel, true);
  });
});