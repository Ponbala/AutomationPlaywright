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
        await (await this.page.waitForSelector(this.continue)).waitForElementState("enabled");
        await this.page.locator(this.continue).click();
    };

    async fillRegistrationFieldValues(nameValue: string, postalCode: string) {
        await this.page.locator(this.firstName).fill(nameValue);
        await this.page.locator(this.lastName).fill(nameValue);
        await this.page.locator(this.postalCode).fill(postalCode);
    };
}