import { Page } from "@playwright/test";

export class DirectoryPage {
    readonly page: Page;
    readonly employeeName: string;
    readonly jobTitle: string;
    readonly location: string;
    readonly search: string;
    readonly reset: string;
    readonly recordsCount: string;
    readonly employeeCardHeader: string;

    constructor(page: Page) {
        this.page = page;
        this.employeeName = "//label[text()='Employee Name']/../..//input";
        this.jobTitle = "//label[text()='Job Title']/../../..//div[@class='oxd-select-text-input']";
        this.location = "//label[text()='Location']/../../..//div[@class='oxd-select-text-input']";
        this.search = "[type='submit']";
        this.reset = "[type='reset']";
        this.recordsCount = ".orangehrm-horizontal-padding span";
        this.employeeCardHeader = ".orangehrm-directory-card .orangehrm-directory-card-header";
    }

    async getRecordsCount() {
        return await this.page.locator(this.recordsCount).textContent();
    }

    async getEmployeeName() {
        return await this.page.locator(this.employeeCardHeader).textContent();
    }
}