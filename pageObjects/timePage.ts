import { Page,expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { Utils } from "../support/utils";
import { DirectoryPage } from "./directoryPage";
import { HomePage } from "./homePage";
import { PerformancePage } from "./performancePage";
import { MyInfoPage } from "./myInfoPage";


let utils:Utils, homePage: HomePage, directoryPage: DirectoryPage, myInfoPage: MyInfoPage;
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
            projectInfo: "//span[text()='Project Info ']",
            customers: "//a[text()='Customers']",
            projects: "//a[text()='Projects']",
            attendance: "//span[text()='Attendance ']",
            timesheets: "//span[text()='Timesheets ']",
            reports: "//span[text()='Reports ']",
            punchInOut: "//a[text()='Punch In/Out']"
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
        this.punchInOut = {
            date: "//label[text()='Date']/../..//input",
            time: "//label[text()='Time']/../..//input",
            note: "//label[text()='Note']/../..//textarea",
            in: "//button[text()=' In ']",
            out: "//button[text()=' Out ']"
        }
        this.timesheets = {
            editButton: "//button[text()=' Edit ']",
            project: "//label[text()='Project']/../..//input",
            activity: "//div[@class='oxd-select-text-input']",
            timeInputCell: "td input.oxd-input"
        }
        this.reports = {
            project: "//label[text()='Project Name']/../..//input"
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

    async deleteCustomers() {
        let rowLength = await this.page.locator(this.cusomterRow('APlay Test Ltd')).count();
        for (let i = 0; i < rowLength; i++) {
            let row = await this.cusomterRow('APlay Test Ltd');
            let isCustomerAlreadyPresent = await this.page.locator(row).isVisible();
            console.log("isCustomerAlreadyPresent",isCustomerAlreadyPresent);
            if (isCustomerAlreadyPresent) {
                let matchedRow = await this.cusomterRow('APlay Test Ltd');
                console.log("match",matchedRow);
                await this.page.locator(matchedRow).locator("../..//i[@class='oxd-icon bi-trash']").click({force:true});
                await myInfoPage.page.waitForSelector(myInfoPage.attachments.confirmationPopup);
                await myInfoPage.page.locator(myInfoPage.attachments.popupDeleteButton).click();
                expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            }
        }
    }
}