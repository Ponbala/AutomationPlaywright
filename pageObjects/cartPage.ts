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
        await this.page.waitForSelector(this.checkout);
        await this.page.locator(this.checkout).click();
    };
}