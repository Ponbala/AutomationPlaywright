import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';

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
    readonly contactDetails: string;
    readonly emergencyContactDetails: any;
    readonly container: string;
    readonly nameInputField: string;
    readonly dependentsDetails: any;
    readonly immigrationDetails: any;

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
        this.bloodType = `//label[text()='Blood Type']/../..//*[@class='oxd-select-wrapper']/div`;
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
        this.container = '.orangehrm-edit-employee-content';
        this.nameInputField = '//label[text()="Name"]/../..//div/input';
        this.contactDetailsLocators = {
            street1: '//label[text()="Street 1"]/../..//div/input',
            street2: '//label[text()="Street 2"]/../..//div/input',
            city: '//label[text()="City"]/../..//div/input',
            state: '//label[text()="State/Province"]/../..//div/input',
            zip: '//label[text()="Zip/Postal Code"]/../..//div/input',
            home: '//label[text()="Home"]/../..//div/input',
            mobile: '//label[text()="Mobile"]/../..//div/input',
            work: '//label[text()="Work"]/../..//div/input',
            workEmail: '//label[text()="Work Email"]/../..//div/input',
            otherEmail: '//label[text()="Other Email"]/../..//div/input',
            country: '//label[text()="Country"]/../../..//div[@class="oxd-select-text--after"]'
        }
        this.emergencyContactDetails = {
            emergencyContactMenuLink: `//a[text()="Emergency Contacts"]`,
            relationship: '//label[text()="Relationship"]/../..//div/input',
            homeTelephone: '//label[text()="Home Telephone"]/../..//div/input',
            mobile: '//label[text()="Mobile"]/../..//div/input',
            workTelephone: '//label[text()="Work Telephone"]/../..//div/input'
        }
        this.dependentsDetails = {
            dependentsMenuLink: `//a[text()="Dependents"]`,
            relationship: '//label[text()="Relationship"]/../../..//div[@class="oxd-select-text--after"]'
        }
        this.immigrationDetails = {
            immigrationDetailsMenuLink: '//a[text()="Immigration"]',
            passportOption: '//div[@class="oxd-radio-wrapper"]//input[@value="1"]',
            number: '//label[text()="Number"]/../..//input[@class="oxd-input oxd-input--active"]',
            issuedDate: '//label[text()="Issued Date"]/../..//input[@class="oxd-input oxd-input--active"]',
            expiryDate: '//label[text()="Expiry Date"]/../..//input[@class="oxd-input oxd-input--active"]',
            eligibleStatus: '//label[text()="Eligible Status"]/../..//input[@class="oxd-input oxd-input--active"]',
            issuedBy: "//label[text()='Issued By']/../../..//div[@class='oxd-select-text oxd-select-text--active']",
            eligibleReviewDate: '//label[text()="Eligible Review Date"]/../..//input[@class="oxd-input oxd-input--active"]',
            comments: '[placeholder="Type Comments here"]',
            comment: '[placeholder="Type comment here"]',
        }
    }

    async clearTextBoxValues(locatorValue: any) {
        await this.page.locator(locatorValue).fill('');
        await this.page.waitForTimeout(1000);
    };

    async isDeleteButtonPresent() {
        return await this.page.locator(this.deleteSelectedButton).isVisible();
    }

    async fillTextBoxValues(locatorValue: any, fillValue: any) {
        await (await this.page.waitForSelector(locatorValue)).waitForElementState("stable");
        await this.page.locator(locatorValue).type(fillValue);
    };

    async fillDateValue(locatorValue: any, fillValue: any) {
        await this.page.locator(locatorValue).fill(fillValue);
    };

    async selecDropdownOption(locator: any, optionValue: any) {
        await this.click(locator);
        await this.page.getByRole('option', { name: optionValue }).getByText(optionValue, { exact: true }).click();
    };

    async clickSave(locatorValue: string, index: number, messageToVerify?: string) {
        await this.page.locator(locatorValue).nth(index).click();
        expect(await this.getToastMessage()).toEqual(messageToVerify);
        await this.clickCloseIcon();
    }

    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    }

    async clickCloseIcon() {
        await this.page.locator(this.closeIcon).click();
    }

    async click(locator: any) {
        await this.page.locator(locator).click({ force: true });
    }

    async clickElementWithIndex(locatorValue, index) {
        await this.page.locator(locatorValue).nth(index).click();
    }

    async uploadFile(filePath: any, value: boolean) {
        await this.click(this.addButton);
        await this.page.waitForSelector(this.browseButton);
        // this.page.on("filechooser", async (filechooser) => {
        //     await filechooser.setFiles('uploadTextFile.txt')
        //   });
        await this.page.setInputFiles(this.uploadElement, filePath);
        await this.fillTextBoxValues(this.immigrationDetails.comment, Constants.fillText.comment);
        await this.page.waitForTimeout(3000);
        if (value) {
            await this.page.locator(this.save).last().click();
            expect(await this.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
            await this.clickCloseIcon();
        }
        else {
            await this.click(this.cancel);
            await this.page.waitForSelector(this.noRecordsText);
        }
    }

    async deleteExistingFiles() {
        if (await this.isDeleteButtonPresent()) {
            await (await this.page.waitForSelector(this.deleteSelectedButton)).waitForElementState("stable");
            expect(this.page.locator(this.deleteSelectedButton)).toBeVisible();
            await this.click(this.deleteSelectedButton);
            await this.page.waitForSelector(this.confirmationPopup);
            await this.page.locator(this.popupDeleteButton).click();
            expect(await this.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            await this.page.waitForTimeout(3000);
            const record = await this.page.locator(this.noRecordsText).textContent();
            expect(record).toContain(Constants.noRecordsText);
        }
    }

    async clickContactDetailsMenu() {
        await this.page.waitForSelector(this.contactDetails);
        await this.page.getByRole('link', { name: 'Contact Details' }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    async clickEmergencyContactsMenu() {
        await this.page.waitForSelector(this.emergencyContactDetails.emergencyContactMenuLink);
        await this.page.getByRole('link', { name: 'Emergency Contacts' }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    async clickDependentsMenu() {
        await this.page.waitForSelector(this.dependentsDetails.dependentsMenuLink);
        await this.page.getByRole('link', { name: 'Dependents' }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    async clickMenu(locator, menuLink) {
        await this.page.waitForSelector(locator);
        await this.page.getByRole('link', { name: menuLink }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    }

    async deleteAttachedFile(confirmation: string) {
        if (confirmation == "cancel") {
            await this.page.locator(this.deleteIcon).first().click();
            await this.page.waitForSelector(this.confirmationPopup);
            expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.getByRole('button', { name: /^\s*No, Cancel\s*$/i }).click();
            expect(this.page.locator(this.attachemtRow).first()).toBeVisible();
        }
        else {
            await this.page.locator(this.deleteIcon).first().click();
            await this.page.waitForSelector(this.confirmationPopup);
            expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.locator(this.popupDeleteButton).click();
            expect(this.page.locator(this.attachemtRow).first()).not.toBeVisible();
        }
    };

    async fillFieldValues(namesLocators: any, values: any) {
        for (const locator of namesLocators) {
            await this.clearTextBoxValues(locator);
            const index = namesLocators.indexOf(locator);
            await this.fillTextBoxValues(locator, values[index]);
            await this.page.waitForTimeout(3000);
        };
    }

    async copyPaste(sourceLocator, destinationLocator) {
        await this.page.locator(sourceLocator).dblclick();
        await this.page.locator(sourceLocator).press('Control+C');
        await this.page.locator(destinationLocator).press('Control+V');
    }
}