import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { Utils } from "../support/utils";

let utils: Utils;

export class PerformancePage {
    readonly page: Page;
    readonly keyPerformanceIndicators: any;
    readonly addPerformanceTracker: any;
    readonly myTracker: any;
    readonly employeeTrackers: any;
    readonly logElements: any;
    readonly manageReviews: any;
    readonly save: string;
    readonly add: string;
    readonly cancel: string;
    readonly addReview: any;
    readonly myReview: any;
    readonly attachments: any;

    constructor(page: Page) {
        this.page = page;
        utils = new Utils(page);
        this.save = "button[type='submit']";
        this.add = "//button[text()=' Add ']";
        this.cancel = "//button[text()=' Cancel ']";
        this.keyPerformanceIndicators = {
            search: "(//div[@class='oxd-form-actions']//button)[2]",
            comment: "//p[.='Add Tracker Log']/../..//textarea",
            backgroundContainer: '.orangehrm-background-container',
            logPopup: '.oxd-dialog-sheet',
            configure: "//span[contains(text(),'Configure')]",
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
            myTrackerView: "//h5[text()='AB Playwright Test']"
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
        this.manageReviews = {
            manageReviewsMenu: "//span[text()='Manage Reviews ']",
        }
        this.myReview = {
            complete: '.orangehrm-performance-review-actions button',
            confirmationReviewPopup: '.oxd-dialog-sheet',
            popupButtons: '.oxd-dialog-sheet button',
            dueDate: "//div[text()='2023-03-30']"
        }
        this.addReview = {
            employeeName: "//label[text()='Employee Name']/../..//input",
            supervisorReviewer: "//label[text()='Supervisor Reviewer']/../..//input",
            reviewPeriodStartDate: "//label[text()='Review Period Start Date']/../..//input",
            reviewPeriodEndDate: "//label[text()='Review Period End Date']/../..//input",
            reviewDueDate: "//label[text()='Due Date']/../..//input",
            activate: "//button[text()=' Activate ']",
            table: ".oxd-table",
            deleteIcon: ".oxd-icon.bi-trash",
            editIcon: ".oxd-icon.bi-pencil-fill",
            tableRow: "//div[@class='oxd-table-card']/div[@role='row']",
            tableRowCells: "//div[@class='oxd-table-card']/div[@role='row']/div[@role='cell']"
        }
        this.attachments = {
            browseButton: '//div[text()="Browse"]',
            uploadElement: '.oxd-file-input',
            cancel: '.oxd-form-actions button[type="button"]',
            noRecordsText: '.orangehrm-horizontal-padding .oxd-text.oxd-text--span',
            attachmentCheckBox: "(//i[contains(@class,'oxd-icon bi-check')])[2]",
            deleteSelectedButton: 'button.orangehrm-horizontal-margin',
            deleteIcon: 'i.oxd-icon.bi-trash',
            confirmationPopup: 'div.orangehrm-dialog-popup',
            popupText: 'p.oxd-text--card-body',
            attachemtRow: 'div.oxd-table-card',
            table: '.oxd-table-body',
            popupDeleteButton: '(//div[@class="orangehrm-modal-footer"]//button)[2]'
        }
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
        await utils.fillTextBoxValues(this.logElements.log, "AB pw test");
        await utils.clickElementWithIndex(this.logElements.positive, 0);
        await utils.fillTextBoxValues(this.keyPerformanceIndicators.comment, "Filled Logs");
        await utils.clickSave(this.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await this.page.waitForSelector(this.logElements.employeeTrackerLogContainer);
    }

    //This function is used to "Delete Logs" in Employee Tracker page
    async deleteLogs() {
        await utils.click(this.logElements.verticalDots);
        await utils.click(this.logElements.delete);
        await this.page.waitForSelector(this.attachments.confirmationPopup);
        await this.page.locator(this.attachments.popupDeleteButton).click();
        let toastMsg = await utils.getToastMessage();
        expect(toastMsg).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await this.page.waitForSelector(this.logElements.noRecords);
    }

    async getRowDetails() {
        // let sd = await this.getARow();
        await this.page.waitForSelector(this.addReview.tableRow);
        let cells = await this.page.locator(this.addReview.tableRowCells).allTextContents();
        console.log("getRowDetails", cells);
        return {
            employee: cells[1],
            jobTitle: cells[2],
            reviewPeriod: cells[3],
            reviewDueDate: cells[4],
            reviewer: cells[5],
            reviewStatus: cells[6]
        }
    }

   

    async getMyReviewDetails(columnValue) {
        // let row = await this.getARow(columnValue);
        await this.page.waitForSelector(this.addReview.tableRow);
        let rowCellValues = await this.page.locator(`//div[@class='oxd-table-card']//div[@role='cell']/div[text()='${columnValue}']/../..//div[@role='cell']/div`).allTextContents();
        console.log("rowCellValues", rowCellValues);
        return {
            jobTitle: rowCellValues[0],
            subUnit: rowCellValues[1],
            reviewPeriod: rowCellValues[2],
            reviewDueDate: rowCellValues[3],
            selfEvaluationStatus: rowCellValues[4],
            reviewStatus: rowCellValues[5]
        }
    }
}