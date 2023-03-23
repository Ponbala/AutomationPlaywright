import { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly homePage: any;

    constructor(page: Page) {
        this.page = page;
        this.homePage = {
            myInfo: '//span[text()="My Info"]',
            directory: '//span[text()="Directory"]',
            dashboardGrid: 'div.orangehrm-dashboard-grid'
        }
    }
}