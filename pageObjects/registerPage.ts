import { Page } from "@playwright/test";

export class RegisterPage {
    readonly page: Page;
    readonly firstName: string;
    readonly lastName: string;
    readonly postalCode: string;
    readonly continue: string;

    constructor(page: Page) {
        this.page = page;
        this.firstName = '#first-name';
        this.lastName = '#last-name';
        this.postalCode = '#postal-code';
        this.continue = '#continue';
    }

    async clickContinue() {
        await this.page.waitForSelector(this.continue);
        await this.page.locator(this.continue).click();
    };
}