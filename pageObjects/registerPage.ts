import { Page } from "@playwright/test";
import { CheckoutPage } from '../pageObjects/checkoutPage';

let checkoutPage: CheckoutPage;

export class RegisterPage {
    readonly page: Page;
    readonly firstName: string;
    readonly lastName: string;
    readonly postalCode: string;
    readonly continue: string;

    constructor(page: Page) {
        this.page = page;
        checkoutPage = new CheckoutPage(page);
        this.firstName = '#first-name';
        this.lastName = '#last-name';
        this.postalCode = '#postal-code';
        this.continue = '#continue';
    }

    async clickContinue() {
        await (await this.page.waitForSelector(this.continue)).waitForElementState("enabled");
        await this.page.locator(this.continue).click();
    };

    async fillRegistrationFieldValues(firstName: string, lastName: string, postalCode: string) {
        await this.page.locator(this.firstName).fill(firstName);
        await this.page.locator(this.lastName).fill(lastName);
        await this.page.locator(this.postalCode).fill(postalCode);
        await this.clickContinue();
    };
}