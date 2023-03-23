import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { MyInfoPage } from "./myInfoPage";

let myInfoPage: MyInfoPage;

export class PerformancePage {
    readonly page: Page;
    readonly keyPerformanceIndicators: any;
    readonly addPerformanceTracker: any;
    readonly myTracker: any;
    readonly employeeTrackers: any;
    readonly logElements: any;

    constructor(page: Page) {
        this.page = page;
        myInfoPage = new MyInfoPage(page);
        this.keyPerformanceIndicators = {
            search: "(//div[@class='oxd-form-actions']//button)[2]",
            comment: "//p[.='Add Tracker Log']/../..//textarea",
            backgroundContainer: '.orangehrm-background-container',
            logPopup: '.oxd-dialog-sheet',
            save: "button[type='submit']",
            configure: "//span[contains(text(),'Configure')]",
            add: "//button[text()=' Add ']",
            keyPerformanceIndicator: "//label[text()='Key Performance Indicator']/../..//input",
            jobTitle: "//label[text()='Job Title']/../../..//div[@class='oxd-select-text-input']"
        }
        this.addPerformanceTracker = {
            trackerName: "//label[text()='Tracker Name']/../..//input",
            employeeName: "//label[text()='Employee Name']/../..//input",
            reviewers: "//label[text()='Reviewers']/../..//input"
        }
        this.myTracker = {
            view: "[name='view']",
            myTrackerView: "//h5[text()='Tracker for paul']"
        }
        this.employeeTrackers = {
            employeeTrackerView: "//h5[text()='AB Playwright Test']",
            include: "//label[text()='Include']/../..//div[@class='oxd-select-text-input']"
        }
        this.logElements = {
            addLog: "//button[text()= ' Add Log ']",
            log: "//label[text()='Log']/../..//input",
            positive: '.orangehrm-add-tracker-log-ratings-container button',
            employeeTrackerLogContainer: '.orangehrm-employee-tracker-log',
            verticalDots: '.bi-three-dots-vertical',
            delete: "//p[.='Delete']",
            noRecords: "//p[.='No Records Found']"
        }
    }

    // This function is used to "get the text" of any elements
    async getText(locator) {
        return await this.page.locator(locator).textContent();
    }

    // This function is used to "click the element/link"
    async clickByRole(role, value) {
        await this.page.getByRole(role, { name: value, exact: true }).click();
        await this.page.waitForSelector(this.keyPerformanceIndicators.backgroundContainer);
    }

    // This function is used to "select the option" from "Auto suggestion"
    async clickOption(role, value) {
        await this.page.getByRole(role, { name: value }).getByText(value, { exact: true }).click();
    }

    // This function is used to get the "specific row checkbox"
    async getARowCheckbox(value) {
        return this.page.locator(`//div[text()='${value}']/../..//input[@type='checkbox']`);
    }

    // This function is used to get the "specific row"
    async getARow(value) {
        await this.page.waitForSelector(`//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`);
        return this.page.locator(`//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`);
    }

    // This function is used to click on "View" and return the tracker visibility status
    async clickViewAndVerify() {
        await this.page.locator(this.myTracker.view).click();
        await this.page.waitForSelector(this.keyPerformanceIndicators.backgroundContainer);
        await (await this.page.waitForSelector(this.myTracker.myTrackerView)).waitForElementState("stable");
        let myTracker = await this.page.locator(this.myTracker.myTrackerView).isVisible();
        return myTracker;
    }

    // This function is used to click on "View" of the specific row
    async getViewAndClick(cellText, index) {
        let empPerfTracker = await this.getARow(cellText);
        let empPerfTrackerView = empPerfTracker.locator("../..//button");
        await empPerfTrackerView.nth(index).click();
        await (await this.page.waitForSelector(this.employeeTrackers.employeeTrackerView)).waitForElementState("stable");
    }

    // This function is used to get "Employee Tracker" View visible status
    async isEmployeeTrackerViewVisible() {
        return await this.page.locator(this.employeeTrackers.employeeTrackerView).isVisible();
    }

    //This function is used to "Create Logs" in Employee Tracker page
    async createLogs() {
        await this.page.waitForSelector(this.keyPerformanceIndicators.logPopup);
        await myInfoPage.fillTextBoxValues(this.logElements.log, "AB pw test");
        await myInfoPage.clickElementWithIndex(this.logElements.positive, 0);
        await myInfoPage.fillTextBoxValues(this.keyPerformanceIndicators.comment, "Filled Logs");
        await myInfoPage.clickSave(this.keyPerformanceIndicators.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await this.page.waitForSelector(this.logElements.employeeTrackerLogContainer);
    }

    //This function is used to "Delete Logs" in Employee Tracker page
    async deleteLogs() {
        await myInfoPage.click(this.logElements.verticalDots);
        await myInfoPage.click(this.logElements.delete);
        await this.page.waitForSelector(myInfoPage.attachments.confirmationPopup);
        await this.page.locator(myInfoPage.attachments.popupDeleteButton).click();
        let toastMsg = await myInfoPage.getToastMessage();
        expect(toastMsg).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await this.page.waitForSelector(this.logElements.noRecords);
    }
}