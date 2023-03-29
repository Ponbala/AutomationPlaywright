import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { Utils } from "../support/utils";
import { DirectoryPage } from "./directoryPage";
import { HomePage } from "./homePage";
import { PerformancePage } from "./performancePage";
import { MyInfoPage } from "./myInfoPage";


let utils: Utils, homePage: HomePage, directoryPage: DirectoryPage, myInfoPage: MyInfoPage;
let performancePage: PerformancePage;

export class TimePage {
    readonly page: Page;
    readonly timeElements: any;
    readonly cusomterRow: any;
    readonly customerRowCells: any;
    readonly projects: any;
    readonly name: string;
    readonly description: string;
    readonly save: string;
    readonly punchInOut: any;
    readonly timesheets: any;
    readonly reports: any;
    readonly attendance: any;

    constructor(page: Page) {
        this.page = page;
        utils = new Utils(page);
        homePage = new HomePage(page);
        myInfoPage = new MyInfoPage(page);
        directoryPage = new DirectoryPage(page);
        performancePage = new PerformancePage(page);
        this.name = "//label[text()='Name']/../..//input";
        this.description = "//label[text()='Description']/../..//textarea";
        this.save = "[role='document'] button[type='submit']";
        this.timeElements = {
            timesheets: "//span[text()='Timesheets ']",
            myTimesheets: "//a[text()='My Timesheets']",
            employeeTimesheets: "//a[text()='Employee Timesheets']",
            attendance: "//span[text()='Attendance ']",
            myRecords: "//a[text()='My Records']",
            punchInOut: "//a[text()='Punch In/Out']",
            employeeRecords: "//a[text()='Employee Records']",
            configuration: "//a[text()='Configuration']",
            reports: "//span[text()='Reports ']",
            projectReports: "//a[text()='Project Reports']",
            employeeReports: "//a[text()='Employee Reports']",
            attendanceSummary: "//a[text()='Attendance Summary']",
            projectInfo: "//span[text()='Project Info ']",
            customers: "//a[text()='Customers']",
            projects: "//a[text()='Projects']",
            employeeName: "//label[text()='Employee Name']/../..//input",
            date: "//label[text()='Date']/../..//input",
            view: "[type='submit']",
            tableContainer: ".oxd-table"
        }
        this.timesheets = {
            editButton: "//button[text()=' Edit ']",
            project: "//label[text()='Project']/../..//input",
            activity: "//div[@class='oxd-select-text-input']",
            timeInputCell: "td input.oxd-input",
            tableView: "//div[@class='oxd-table-cell-actions']/button[text()=' View ']",
            totalhrs: "//span[text()='APlay Test Ltd - Demo Play Project']/../..//td[contains(@class,'--freeze-right')]",
        }
        this.punchInOut = {
            time: "//label[text()='Time']/../..//input",
            note: "//label[text()='Note']/../..//textarea",
            in: "//button[text()=' In ']",
            out: "//button[text()=' Out ']"
        }
        this.attendance = {
            tableData: ".oxd-table-card div.oxd-table-row",
            switch: ".orangehrm-attendance-field-row div",
            deleteIcon: ".oxd-icon.bi-trash"
        }
        this.reports = {
            project: "//label[text()='Project Name']/../..//input",
            employeeReportsTable: ".inner-content-table .vertical-inner",
            maximize: ".oxd-icon.bi-arrows-fullscreen",
            minimize: ".oxd-icon.bi-fullscreen-exit",
            totalDurationHours: ".rgRow div.col-alt",
            reportsTableContainer: ".orangehrm-paper-container",
        }
        this.projects = {
            customerName: "//label[text()='Customer Name']/../..//input",
            project: "//label[text()='Project']/../..//input",
            projectAdmin: "//label[text()='Project Admin']/../..//input",
            addCustomer: "//button[text()=' Add Customer ']",
            addCustomerDialog: ".oxd-dialog-sheet",
            addCustomerDialogName: "//div[@role='document']//label[text()='Name']/../..//input",
            addCustomerDialogDescription: "//div[@role='document']//label[text()='Description']/../..//textarea",
            filterArea: ".oxd-table-filter-area",
            search: "[type='submit']"
        }
        this.customerRowCells = (companyName) => {
            return `//div[@class='oxd-table-card']/div[@role='row']//div[text()='${companyName}']/../..//div[@role="cell"]`;
        }
        this.cusomterRow = (companyName) => {
            return `//div[@class='oxd-table-card']/div[@role='row']//div[text()='${companyName}']`;
        }
    }

    // This function is used to "get a Row cells values" by its Column Text
    async getARowByColumnText(companyName: string) {
        await this.page.waitForSelector(await this.cusomterRow(companyName));
        let rowCells = this.page.locator(await this.customerRowCells(companyName));
        let rowcellsText = await rowCells.allTextContents();
        return {
            checkbox: rowcellsText[0],
            companyName: rowcellsText[1],
            description: rowcellsText[2]
        }
    }

    async getTimesheetActionTable(user: string) {
        await this.page.waitForSelector(await this.cusomterRow(user));
        let rowCells = this.page.locator(await this.customerRowCells(user));
        let rowcellsText = await rowCells.allTextContents();
        return {
            actions: rowcellsText[0],
            performedBy: rowcellsText[1],
            date: rowcellsText[2],
            comment: rowcellsText[3],
        }
    }

    async getAttendanceRowCells(value: string) {
        await (await this.page.waitForSelector(await this.cusomterRow(value))).waitForElementState("stable");
        let rowCells = await this.page.locator(await this.customerRowCells(value));
        let rowcellsText = await rowCells.allTextContents();
        console.log("rowcellsText", rowcellsText);
        return {
            checkbox: rowcellsText[0],
            punchIn: rowcellsText[1],
            punchInNote: rowcellsText[2],
            punchOut: rowcellsText[3],
            punchOutNote: rowcellsText[4],
            duration: rowcellsText[5]
        }
    }

    async deleteCustomers() {
        let rowLength = await this.page.locator(this.cusomterRow('APlay Test Ltd')).count();
        for (let i = 0; i < rowLength; i++) {
            let row = await this.cusomterRow('APlay Test Ltd');
            let isCustomerAlreadyPresent = await this.page.locator(row).isVisible();
            console.log("isCustomerAlreadyPresent", isCustomerAlreadyPresent);
            if (isCustomerAlreadyPresent) {
                let matchedRow = await this.cusomterRow('APlay Test Ltd');
                console.log("match", matchedRow);
                await this.page.locator(matchedRow).locator("../..//i[@class='oxd-icon bi-trash']").click({ force: true });
                await myInfoPage.page.waitForSelector(myInfoPage.attachments.confirmationPopup);
                await myInfoPage.page.locator(myInfoPage.attachments.popupDeleteButton).click();
                expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            }
        }
    }
}