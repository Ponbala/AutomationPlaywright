import { Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly finish: string;
    readonly cancel: string;
    readonly orderMsg: string;
    readonly backToHome: string;

    constructor(page: Page) {
        this.page = page;
        this.finish = '#finish';
        this.cancel = '#cancel';
        this.orderMsg = 'div.complete-text';
        this.backToHome = '#back-to-products';
    }

    async clickCancel() {
        await (await this.page.waitForSelector(this.cancel)).waitForElementState("stable");
        await this.page.locator(this.cancel).click();
    };

    async getOrderSuccessMsg() {
        await (await this.page.waitForSelector(this.orderMsg)).waitForElementState("visible");
        return await this.page.locator(this.orderMsg).textContent();
    }

    async clickBackToHome() {
        await (await this.page.waitForSelector(this.backToHome)).waitForElementState("stable");
        await this.page.getByRole('button', { name: 'Back Home' }).click();
    }

    async clickFinish() {
        await (await this.page.waitForSelector(this.finish)).waitForElementState("stable");
        await this.page.getByRole('button', { name: 'Finish' }).click();
    }
}