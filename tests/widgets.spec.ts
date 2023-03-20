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
});

test.afterAll(async () => {
  await page.close();
});

// test.describe('Widgets', () => {
/*test('Accordian test', async () => {
    await widgetPage.clickElementWithIndex(widgetPage.card, 3);
await page.waitForSelector(widgetPage.accordianContainer);
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
  expect(await widgetPage.getValue(widgetPage.multiSelectValues, true)).toEqual(Constants.colours.blueAndBlack);
  await widgetPage.selectOption(Constants.roles.textBoxRole, 1, Constants.colours.blue);
  expect(await widgetPage.getValue(widgetPage.singleSelectValue)).toEqual(Constants.colours.blue);
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

test('Menu test', async () => {
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

test('Slider test', async () => {
  await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.slider, widgetPage.sliderContainer);
  await widgetPage.moveSlider();
});

test('Progress Bar test', async () => {
  await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.progressBar, widgetPage.progressBarContainer);
  await widgetPage.clickElement(widgetPage.startStop);
  await widgetPage.progressBarWidget();
});*/

test.describe('Forms', () => {
  test('Practice Forms test', async () => {
    await widgetPage.clickElementWithIndex(widgetPage.card, 1);
    await widgetPage.clickElementForGetByRole(Constants.roles.listItemRole, Constants.textValues.practiceForm);
    await page.locator('#firstName').clear();
    await page.locator('#firstName').fill('Pon');
    await page.locator('#lastName').clear();
    await page.locator('#lastName').fill('Balan');
    await page.locator('#userEmail').clear();
    await page.locator('#userEmail').fill('test@gmail.com');
    await page.locator('#gender-radio-1').click({ force: true });

    await page.locator("#userNumber").fill("9874636393");
    await page.locator("#dateOfBirthInput").click();
    await page.locator('.react-datepicker__month-select').selectOption('5');
    await page.getByRole('combobox').nth(1).selectOption('2000');
    await page.getByRole('option', { name: 'Choose Friday, June 30th, 2000' }).click();

    await page.locator('.subjects-auto-complete__value-container').click();
    await page.locator('#subjectsInput').fill('En');
    await page.getByText('English', { exact: true }).click();

    await page.locator('#subjectsInput').fill('com');
    await page.getByText('Computer Science', { exact: true }).click();

    await page.locator('#subjectsInput').fill('s');
    await page.getByText('Chemistry', { exact: true }).click();

    await page.locator('#subjectsContainer svg').nth(2).click();
    await page.locator('#subjectsInput').fill('ma');
    await page.getByText('Maths', { exact: true }).click();

    await page.getByText('Music').click();
    await page.setInputFiles('#uploadPicture', 'sampleFile.jpeg');

    await page.getByPlaceholder('Current Address').click();
    await page.getByPlaceholder('Current Address').fill('Hyderabad');

    await page.getByText('Select State', { exact: true }).click();
    await page.getByText('Uttar Pradesh', { exact: true }).click();

    await page.getByText('Select City', { exact: true }).click();
    await page.getByText('Agra', { exact: true }).click();
    await page.getByRole('button', { name: 'Submit', exact: true }).click({force:true});
  });
});