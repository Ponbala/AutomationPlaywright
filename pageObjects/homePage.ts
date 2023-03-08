import { Page, expect } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly myInfo: string;
    readonly myInfoContainer: string;
    readonly dashboardGrid: string;

    constructor(page: Page) {
        this.page = page;
        this.myInfo = '//span[text()="My Info"]';
        this.myInfoContainer = 'div.orangehrm-background-container';
        this.dashboardGrid = 'div.orangehrm-dashboard-grid';
    }

    async clickMyInfoMenu() {
        await (await this.page.waitForSelector(this.myInfo)).waitForElementState('stable');
        await this.page.getByRole('link', { name: 'My Info' }).click();
        await this.page.waitForSelector(this.myInfoContainer);
        await this.page.waitForTimeout(2000);
    };
}