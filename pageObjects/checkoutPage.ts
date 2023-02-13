import { Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly finish: string;
    readonly cancel: string;
    readonly orderMsg: string;

    constructor(page: Page) {
        this.page = page;
        this.finish = '#finish';
        this.cancel = '#cancel';
        this.orderMsg = 'div.complete-text';
    }

    async clickCancel() {
        await this.page.waitForSelector(this.cancel);
        await this.page.locator(this.cancel).click();
    };

    async getOrderSuccessMsg() {
        await this.page.waitForSelector(this.orderMsg);
        return await this.page.locator(this.orderMsg).textContent();
    }

    async clickBackToHome(){
        await this.page.getByRole('button', { name: 'Back Home' }).click();
    }

    async clickFinish(){
        await this.page.getByRole('button', { name: 'Finish' }).click();
    }
}