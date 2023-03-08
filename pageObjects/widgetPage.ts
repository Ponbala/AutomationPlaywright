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

    async clickElement(locator: string, index: number) {
        await this.page.locator(locator).nth(index).click();
        await this.page.waitForTimeout(2000);
    }

    async clickElementForText(text: string | RegExp) {
        await this.page.getByText(text).click();
    }

    async clickElementForGetByRole(role: any, visibleText: string, waitForLocator?) {
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
    async clearTextboxValues(role, index) {
        await this.page.getByRole(role).nth(index).fill('');
    }

    async fillValues(role, index, value) {
        await this.page.getByRole(role).nth(index).type(value);
    }

    async selectOption(role, index, value, isClear?: boolean) {
        if (isClear) {
            await this.clearTextboxValues(role, index);
        }
        await this.fillValues(role, index, value);
        await this.clickOption();
    }

    async getSelectedValues(locator, isMultiple?: boolean) {
        if (isMultiple) {
            return await this.page.locator(locator).allTextContents();
        }
        else {
            return await this.page.locator(locator).textContent();
        }
    }
}