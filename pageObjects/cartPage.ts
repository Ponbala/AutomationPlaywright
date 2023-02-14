import { Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly cartContainer: string;
    readonly checkout: string;

    constructor(page: Page) {
        this.page = page;
        this.cartContainer = '#cart_contents_container';
        this.checkout = '#checkout';
    }

    async clickCheckout() {
        await (await this.page.waitForSelector(this.checkout)).waitForElementState("stable");
        await this.page.locator(this.checkout).click({ force: true });
    };
}