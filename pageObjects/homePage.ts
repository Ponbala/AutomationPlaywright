import { Page, expect } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly myInfo: string;
    readonly directory: string;
    readonly performance: string;
    readonly container: string;
    readonly dashboardGrid: string;

    constructor(page: Page) {
        this.page = page;
        this.myInfo = '//span[text()="My Info"]';
        this.directory = '//span[text()="Directory"]';
        this.performance = '//span[text()="Performance"]';
        this.container = 'div.orangehrm-background-container';
        this.dashboardGrid = 'div.orangehrm-dashboard-grid';
    }

    async clickMenu(locator: string,role: any,linkValue: string) {
        await (await this.page.waitForSelector(locator)).waitForElementState('stable');
        await this.page.getByRole(role, { name: linkValue }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(2000);
    };
}