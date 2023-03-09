import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';

export class WidgetPage {
    readonly page: Page;
    readonly firstName: string;
    readonly card: string;
    readonly accordianContainer: string;
    readonly sectionHeading1: string;
    readonly sectionHeading2: string;
    readonly sectionHeading3: string;
    readonly autoCompleteContainer: string;
    readonly multiSelectValues: string;
    readonly singleSelectValue: string;
    readonly autoCompleteOption: string;
    readonly dataPickerContainer: string;
    readonly monthYearInput: string;
    readonly monthYearTimeInput: string;
    readonly monthDropdown: string;
    readonly yearDropdown: string;
    readonly dateContainer: string;
    readonly tabsContainer: string;
    readonly whatTab: string;
    readonly originTab: string;
    readonly useTab: string;
    readonly moreTab: string;
    readonly tooltipButton: string;
    readonly tooltipFieldContainer: string;
    readonly tooltipContrary: string;
    readonly tooltipDate: string;
    readonly tooltipContainer: string;
    readonly tooltipText: string;

    constructor(page: Page) {
        this.page = page;
        this.card = '.card.mt-4.top-card';
        this.accordianContainer = '.container.playgound-body';
        this.sectionHeading1 = '//div[@id="section1Heading"]/..//div[contains(@class, "collapse")]';
        this.sectionHeading2 = '//div[@id="section2Heading"]/..//div[contains(@class, "collapse")]';
        this.sectionHeading3 = '//div[@id="section3Heading"]/..//div[contains(@class, "collapse")]';
        this.autoCompleteContainer = '#autoCompleteContainer';
        this.multiSelectValues = '.auto-complete__multi-value__label';
        this.singleSelectValue = '.auto-complete__single-value';
        this.autoCompleteOption = '.auto-complete__menu';
        this.dataPickerContainer = '#datePickerContainer';
        this.dateContainer = '.react-datepicker';
        this.monthYearInput = '#datePickerMonthYearInput';
        this.monthYearTimeInput = '#dateAndTimePickerInput';
        this.monthDropdown = '.react-datepicker__month-select';
        this.yearDropdown = '.react-datepicker__year-select';
        this.tabsContainer = '#tabsContainer';
        this.whatTab = '#demo-tab-what';
        this.originTab = '#demo-tab-origin';
        this.useTab = '#demo-tab-use';
        this.moreTab = '#demo-tab-more';
        this.tooltipButton = '#toolTipButton';
        this.tooltipFieldContainer = '#texFieldToolTopContainer';
        this.tooltipContrary = "//div[@id='texToolTopContainer']/a[text()='Contrary']";
        this.tooltipDate = "//div[@id='texToolTopContainer']/a[text()='1.10.32']";
        this.tooltipContainer = '#toopTipContainer';
        this.tooltipText = '.tooltip-inner';

        // this.contactDetailsLocators = {
        //     street1: '//label[text()="Street 1"]/../..//div/input'
        // }
    }

    async getBaseURL() {
        await this.page.goto('/');
    }

    async getSectionValue(locator: string) {
        let sectionValue = await this.page.locator(locator).getAttribute('class');
        return sectionValue;
    }

    async clickElementWithIndex(locator: string, index: number) {
        await this.page.locator(locator).nth(index).click();
        await this.page.waitForTimeout(2000);
    }

    async clickElement(locator: string) {
        await this.page.locator(locator).click();
    }

    async clickElementForText(text: string | RegExp) {
        await this.page.getByText(text, { exact: true }).click();
    }

    async clickElementForGetByRole(role: any, visibleText: string, waitForLocator?: string) {
        await this.page.getByRole(role).filter({ hasText: visibleText }).click();
        if (waitForLocator) {
            await this.page.waitForSelector(waitForLocator);
        }
    }

    async collapseAndExpand(sectionValue: string, locator: string, collapseShow: string, collapseHide: string) {
        await this.clickElementForText(sectionValue);
        let section1Value = await this.getSectionValue(locator);
        expect(section1Value).toContain(collapseShow);
        await this.clickElementForText(sectionValue);
        expect(section1Value).toContain(collapseHide);
    }

    async clickOption() {
        await this.page.locator(this.autoCompleteOption).click();
    }
    async clearTextboxValues(role: any, index: number) {
        await this.page.getByRole(role).nth(index).fill('');
    }

    async fillValues(role: any, index: number, value: string) {
        await this.page.getByRole(role).nth(index).type(value);
    }

    async selectOption(role: any, index: any, value: any, isClear?: boolean) {
        if (isClear) {
            await this.clearTextboxValues(role, index);
        }
        await this.fillValues(role, index, value);
        await this.clickOption();
    }

    async getSelectedValues(locator: string, isMultiple?: boolean) {
        if (isMultiple) {
            return await this.page.locator(locator).allTextContents();
        }
        else {
            return await this.page.locator(locator).textContent();
        }
    }

    async getInputValue(locator: string) {
        return await this.page.locator(locator).inputValue();
    }

    async selectDateAndGetValue(inputLocator: string, index: number, month: string, day: string, time: string, role: string, isdateAndTime: boolean, year?: string) {
        await this.clickElementWithIndex(inputLocator, index);
        if (!isdateAndTime) {
            await this.page.selectOption(this.monthDropdown, month);
            await this.page.selectOption(this.yearDropdown, year);
            await this.clickElementForText(day);
            return await this.getInputValue(inputLocator);
        }
        else {
            await this.clickElementForText(month);
            await this.clickElementForText(day);
            await this.clickElementForGetByRole(role, time);
            return await this.getInputValue(inputLocator);
        }
    }

    async getWhatTab() {
        return this.page.locator(this.originTab);
    }

    async getOriginTab() {
        return this.page.locator(this.originTab);
    }

    async getMoreTab() {
        return this.page.locator(this.moreTab);
    }

    async getUseTab() {
        return this.page.locator(this.useTab);
    }

    async hoverElement(locator: string) {
        await this.page.locator(locator).hover();
        await this.page.waitForTimeout(1000);
    }

    async getTooltipValue() {
        return this.page.locator(this.tooltipText).textContent();
    }

    async hoverAllElements(locators: any[], tooltipValues: string[]) {
        for (let locator of locators) {
            await this.hoverElement(locator);
            let index = locators.indexOf(locator);
            let hoverValue = await this.getTooltipValue();
            expect(hoverValue).toEqual(tooltipValues[index]);
        }
    }
}