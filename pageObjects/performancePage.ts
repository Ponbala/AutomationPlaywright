import { Page } from "@playwright/test";

export class PerformancePage {
    readonly page: Page;
    readonly search: string;
    readonly comment: string;
    readonly backgroundContainer: string;
    readonly logPopup: string;
    readonly save: string;
    readonly configure: string;
    readonly add: string;
    readonly keyPerformanceIndicator: string;
    readonly jobTitle: string;
    readonly trackerName: string;
    readonly employeeName: string;
    readonly reviewers: string;
    readonly view: string;
    readonly myTrackerView: string;
    readonly include: string;
    readonly employeeTrackerView: string;
    readonly addLog: string;
    readonly log: string;
    readonly positive: string;
    readonly employeeTrackerLogContainer: string;
    readonly verticalDots: string;
    readonly delete: string;
    readonly noRecords: string;

    constructor(page: Page) {
        this.page = page;
        this.search = "(//div[@class='oxd-form-actions']//button)[2]";
        this.comment = "//p[.='Add Tracker Log']/../..//textarea";
        this.backgroundContainer = '.orangehrm-background-container';
        this.logPopup = '.oxd-dialog-sheet';
        this.save = "button[type='submit']";
        this.configure = "//span[contains(text(),'Configure')]";
        this.add = "//button[text()=' Add ']";
        this.keyPerformanceIndicator = "//label[text()='Key Performance Indicator']/../..//input";
        this.jobTitle = "//label[text()='Job Title']/../../..//div[@class='oxd-select-text-input']";
        this.trackerName = "//label[text()='Tracker Name']/../..//input";
        this.employeeName = "//label[text()='Employee Name']/../..//input";
        this.reviewers = "//label[text()='Reviewers']/../..//input";
        this.view = "[name='view']";
        this.myTrackerView = "//h5[text()='Tracker for paul']";
        this.employeeTrackerView = "//h5[text()='AB Playwright Test']";
        this.include = "//label[text()='Include']/../..//div[@class='oxd-select-text-input']";
        this.addLog = "//button[text()= ' Add Log ']";
        this.log = "//label[text()='Log']/../..//input";
        this.positive = '.orangehrm-add-tracker-log-ratings-container button';
        this.employeeTrackerLogContainer = '.orangehrm-employee-tracker-log';
        this.verticalDots = '.bi-three-dots-vertical';
        this.delete = "//p[.='Delete']";
        this.noRecords = "//p[.='No Records Found']";
    }

    async getText(locator) {
        return await this.page.locator(locator).textContent();
    }

    async clickByRole(role, value) {
        await this.page.getByRole(role, { name: value, exact: true }).click();
        await this.page.waitForSelector(this.backgroundContainer);
        // await this.page.waitForTimeout(3000);
    }

    async clickOption(role, value) {
        await this.page.getByRole(role, { name: value }).getByText(value, { exact: true }).click();
    }

    async getARowCheckbox(value) {
        return this.page.locator(`//div[text()='${value}']/../..//input[@type='checkbox']`);
    }

    async getARow(value) {
        return this.page.locator(`//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`);
    }

    async clickViewAndVerify() {
        await this.page.locator(this.view).click();
        await this.page.waitForSelector(this.backgroundContainer);
        await this.page.waitForTimeout(6000);
        await (await this.page.waitForSelector(this.myTrackerView)).waitForElementState("stable");
        let myTracker = await this.page.locator(this.myTrackerView).isVisible();
        return myTracker;
    }
}