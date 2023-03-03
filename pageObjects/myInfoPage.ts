import { Page, expect } from "@playwright/test";

export class MyInfoPage {
    readonly page: Page;
    readonly firstName: string;
    readonly middleName: string;
    readonly lastName: string;
    readonly nickName: string;
    readonly employeeId: string;
    readonly otherId: string;
    readonly driverLicenseNumber: string;
    readonly licenseExpiryDate: string;
    readonly ssnNumber: string;
    readonly sinNumber: string;
    readonly nationality: string;
    readonly maritalStatus: string;
    readonly dateofBirth: string;
    readonly gender: string;
    readonly militaryService: string;
    readonly smoker: string;
    readonly save: string;
    readonly toastMessage: string;
    readonly closeIcon: string;
    readonly bloodType: string;
    readonly addButton: string;
    readonly browseButton: string;
    readonly uploadElement: string;
    readonly commentBox: string;
    readonly cancel: string;
    readonly noRecordsText: string;
    readonly attachmentCheckBox: string;
    readonly deleteSelectedButton: string;
    readonly deleteIcon: string;
    readonly confirmationPopup: string;
    readonly popupText: string;
    readonly attachemtRow: string;
    readonly table: string;
    readonly popupDeleteButton: string;
    readonly contactDetailsLocators: any;
    contactDetails: string;

    constructor(page: Page) {
        this.page = page;
        this.firstName = 'input.orangehrm-firstname';
        this.middleName = 'input.orangehrm-middlename';
        this.lastName = 'input.orangehrm-lastname';
        this.nickName = '//label[text()="Nickname"]/../..//div/input';
        this.employeeId = `//label[text()='Employee Id']/../..//div/input`;
        this.otherId = `//label[text()='Other Id']/../..//div/input`;
        this.driverLicenseNumber = `//label[text()="Driver's License Number"]/../..//div/input`;
        this.licenseExpiryDate = `//label[text()='License Expiry Date']/../..//div/input`;
        this.ssnNumber = '//label[text()="SSN Number"]/../..//div/input';
        this.sinNumber = '//label[text()="SIN Number"]/../..//div/input'
        this.nationality = `//label[text()='Nationality']/../../..//div[@class='oxd-select-text--after']`
        this.maritalStatus = `//label[text()='Marital Status']/../../..//div[@class='oxd-select-text--after']`
        this.dateofBirth = `//label[text()='Date of Birth']/../..//div/input`;
        this.gender = '//label[text()="Gender"]/../../..//div[@class="oxd-radio-wrapper"]/label/input[@value="1"]';
        this.militaryService = `//label[text()='Military Service']/../..//div/input`;
        this.smoker = `//label[text()='Smoker']/../../..//div/label/input[@type='checkbox']`;
        this.save = 'button.oxd-button--medium';
        this.toastMessage = 'p.oxd-text--toast-message';
        this.closeIcon = '.oxd-toast-close-container';
        this.bloodType = `//label[text()='Blood Type']/../../../..//div/i`;
        this.addButton = 'button.oxd-button--text';
        this.browseButton = '//div[text()="Browse"]';
        this.uploadElement = '.oxd-file-input';
        this.commentBox = 'textarea.oxd-textarea';
        this.cancel = '.oxd-form-actions button[type="button"]';
        this.noRecordsText = '.orangehrm-horizontal-padding .oxd-text.oxd-text--span';
        this.attachmentCheckBox = "(//i[contains(@class,'oxd-icon bi-check')])[2]";
        this.deleteSelectedButton = 'button.orangehrm-horizontal-margin';
        this.deleteIcon = 'i.oxd-icon.bi-trash';
        this.confirmationPopup = 'div.orangehrm-dialog-popup';
        this.popupText = 'p.oxd-text--card-body';
        this.attachemtRow = 'div.oxd-table-card';
        this.table = '.oxd-table-body';
        this.popupDeleteButton = '(//div[@class="orangehrm-modal-footer"]//button)[2]';
        this.contactDetails = '//a[text()="Contact Details"]';
        this.contactDetailsLocators = {
            street1 : '//label[text()="Street 1"]/../..//div/input',
            street2 : '//label[text()="Street 2"]/../..//div/input',
            city : '//label[text()="City"]/../..//div/input',
            state : '//label[text()="State/Province"]/../..//div/input',
            zip : '//label[text()="Zip/Postal Code"]/../..//div/input',
            home : '//label[text()="Home"]/../..//div/input',
            mobile : '//label[text()="Mobile"]/../..//div/input',
            work : '//label[text()="Work"]/../..//div/input',
            workEmail : '//label[text()="Work Email"]/../..//div/input',
            otherEmail : '//label[text()="Other Email"]/../..//div/input',
            country : '//label[text()="Country"]/../../..//div[@class="oxd-select-text--after"]',
            container : '.orangehrm-edit-employee-content',
        }
    }

    async clearTextBoxValues(locatorValue:any) {
        await this.page.locator(locatorValue).fill('');
    };

    async isDeleteButtonPresent(){
        return await this.page.locator(this.deleteSelectedButton).isVisible();
    }

    async fillTextBoxValues(locatorValue:any, fillValue: any) {
        await this.page.locator(locatorValue).type(fillValue);
    };

    async fillDateValue(locatorValue:any, fillValue: any) {
        await this.page.locator(locatorValue).fill(fillValue);
    };

    async selecDropdownOption(optionValue: any) {
        await this.page.getByRole('option', { name: optionValue }).getByText(optionValue, { exact: true }).click();
    };

    async clickSave(locatorValue,index){
        await this.page.locator(locatorValue).nth(index).click();
    }

    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    }

    async clickCloseIcon(){
        await this.page.locator(this.closeIcon).click();
    }

    async click(locator: any){
        await this.page.locator(locator).click({ force: true });
    }

    async clickElementWithIndex(locatorValue,index){
        await this.page.locator(locatorValue).nth(index).click();
    }

    async uploadFile(filePath:any){
        await this.page.locator(this.uploadElement).setInputFiles(filePath);
    }

    async clickContactDetailsMenu() {
        await this.page.waitForSelector(this.contactDetails);
        await this.page.getByRole('link', { name: 'Contact Details' }).click();
        await this.page.waitForSelector(this.contactDetailsLocators.container);
        await this.page.waitForTimeout(5000);
    };
}