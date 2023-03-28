import { Page, expect } from "@playwright/test";
import { Utils } from "../support/utils";
import Constants from '../support/constants.json';

let utils: Utils;

export class MyInfoPage {
    readonly page: Page;
    readonly save: string;
    readonly container: string;
    readonly backgroundContainer: string;
    readonly nameInputField: string;
    readonly myInfoPersonalDetails: any;
    readonly toastElements: any;
    readonly attachments: any;
    readonly contactDetailsLocators: any;
    readonly myInfoContactDetails: any;
    readonly emergencyContactDetails: any;
    readonly dependentsDetails: any;
    readonly immigrationDetails: any;
    readonly workExperience: any;
    readonly education: any;
    readonly skills: any;
    readonly languages: any;
    readonly license: any;
    readonly qualifications: any;
    readonly addBtn: any;
    readonly memberships: any;

    constructor(page: Page) {
        this.page = page;
        utils = new Utils(page);
        this.save = 'button.oxd-button--medium';
        this.container = '.orangehrm-edit-employee-content';
        this.backgroundContainer = '.orangehrm-background-container';
        this.nameInputField = '//label[text()="Name"]/../..//div/input';
        this.myInfoPersonalDetails = {
            firstName: 'input.orangehrm-firstname',
            middleName: 'input.orangehrm-middlename',
            lastName: 'input.orangehrm-lastname',
            nickName: '//label[text()="Nickname"]/../..//div/input',
            employeeId: `//label[text()='Employee Id']/../..//div/input`,
            otherId: `//label[text()='Other Id']/../..//div/input`,
            driverLicenseNumber: `//label[text()="Driver's License Number"]/../..//div/input`,
            licenseExpiryDate: `//label[text()='License Expiry Date']/../..//div/input`,
            ssnNumber: '//label[text()="SSN Number"]/../..//div/input',
            sinNumber: '//label[text()="SIN Number"]/../..//div/input',
            nationality: `//label[text()='Nationality']/../../..//div[@class='oxd-select-text--after']`,
            maritalStatus: `//label[text()='Marital Status']/../../..//div[@class='oxd-select-text--after']`,
            dateofBirth: `//label[text()='Date of Birth']/../..//div/input`,
            gender: '//label[text()="Gender"]/../../..//div[@class="oxd-radio-wrapper"]/label/input[@value="1"]',
            militaryService: `//label[text()='Military Service']/../..//div/input`,
            smoker: `//label[text()='Smoker']/../../..//div/label/input[@type='checkbox']`,
            bloodType: `//label[text()='Blood Type']/../..//*[@class='oxd-select-wrapper']/div`
        }
        this.toastElements = {
            toastMessage: 'p.oxd-text--toast-message',
            closeIcon: '.oxd-toast-close-container'
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
        this.contactDetailsLocators = {
            contactDetails: '//a[text()="Contact Details"]',
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
        this.workExperience = {
            company: '//label[text()="Company"]/../..//div/input',
            jobTitle: '//label[text()="Job Title"]/../..//div/input',
            fromDate: '//label[text()="From"]/../..//input',
            toDate: '//label[text()="To"]/../..//input',
            comment: '//h6[.="Add Work Experience"]/..//textarea'
        }
        this.qualifications = {
            qualificationsMenuLink: '//a[text()="Qualifications"]',
            qualificationComment: '.oxd-input-group .oxd-textarea'
        }
        this.education = {
            level: "//label[text()='Level']/../../..//div[@class='oxd-select-text oxd-select-text--active']",
            institute: "//label[text()='Institute']/../..//input",
            majorOrSpecialization: "//label[text()='Major/Specialization']/../..//input",
            year: "//label[text()='Year']/../..//input",
            gpaScore: "//label[text()='GPA/Score']/../..//input",
            startDate: "//label[text()='Start Date']/../..//input",
            endDate: "//label[text()='End Date']/../..//input"
        }
        this.skills = {
            skill: "//label[text()='Skill']/../../..//div[@class='oxd-select-text oxd-select-text--active']",
            yearsOfExperience: "//label[text()='Years of Experience']/../..//input",
            comment: '//h6[.="Add Skill"]/..//textarea'
        }
        this.languages = {
            language: "//label[text()='Language']/../../..//div[@class='oxd-select-text-input']",
            fluency: "//label[text()='Fluency']/../../..//div[@class='oxd-select-text-input']",
            competency: "//label[text()='Competency']/../../..//div[@class='oxd-select-text-input']",
            comment: '//h6[.="Add Language"]/..//textarea'
        }
        this.license = {
            licenseType: "//label[text()='License Type']/../../..//div[@class='oxd-select-text-input']",
            licenseNumber: "//label[text()='License Number']/../..//input",
            issuedDate: "//label[text()='Issued Date']/../..//input",
            expiryDate: "//label[text()='Expiry Date']/../..//input"
        }
        this.memberships = {
            membershipMenuLink: "//a[text()='Memberships']",
            membership: "//label[text()='Membership']/../../..//div[@class='oxd-select-text-input']",
            subscriptionPaidBy: "//label[text()='Subscription Paid By']/../../..//div[@class='oxd-select-text-input']",
            currency: "//label[text()='Currency']/../../..//div[@class='oxd-select-text-input']",
            subscriptionAmount: "//label[text()='Subscription Amount']/../..//input",
            subscriptionCommenceDate: "//label[text()='Subscription Commence Date']/../..//input",
            subscriptionRenewalDate: "//label[text()='Subscription Renewal Date']/../..//input"
        }
        this.addBtn = (section: any) => {
            return `//h6[text()='${section}']/following-sibling::button`;
        }
    }

    // This function is used to "click on Add button"
    async clickAddButton(section: string) {
        await (await this.page.waitForSelector(`//h6[text()='${section}']/following-sibling::button`)).waitForElementState("stable");
        let element = await this.addBtn(section);
        let addButton = this.page.locator(element);
        await addButton.click();
        await (await this.page.waitForSelector(this.container)).waitForElementState("stable");
    }

    // This function is used to verify the presence of "Delete" button and return the boolean value
    async isDeleteButtonPresent() {
        return await this.page.locator(this.attachments.deleteSelectedButton).isVisible();
    }

    // This function is used to "delete the existing files" and asserting
    async deleteExistingFiles() {
        let deleteButton = await this.isDeleteButtonPresent();
        if (deleteButton) {
            await (await this.page.waitForSelector(this.attachments.deleteSelectedButton)).waitForElementState("stable");
            expect(this.page.locator(this.attachments.deleteSelectedButton)).toBeVisible();
            await utils.click(this.attachments.deleteSelectedButton);
            await this.page.waitForSelector(this.attachments.confirmationPopup);
            await this.page.locator(this.attachments.popupDeleteButton).click();
            expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            await (await this.page.waitForSelector(this.attachments.noRecordsText)).waitForElementState("stable");
            const record = await this.page.locator(this.attachments.noRecordsText).textContent();
            expect(record).toContain(Constants.noRecordsText);
        }
    }

    // This function is for "uploading the file" and clicking on Save and verifying cancel button functionality
    async uploadFile(filePath: any, section: string, save: boolean) {
        await this.clickAddButton(section);
        await this.page.waitForSelector(this.attachments.browseButton);
        // this.page.on("filechooser", async (filechooser) => {
        //     await filechooser.setFiles('uploadTextFile.txt')
        //   });
        await this.page.setInputFiles(this.attachments.uploadElement, filePath);
        await utils.fillTextBoxValues(this.immigrationDetails.comment, Constants.fillText.comment);
        if (save) {
            await (await this.page.waitForSelector(this.save)).waitForElementState("stable");
            await this.page.locator(this.save).last().click();
            expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
            await utils.clickCloseIcon();
        }
        else {
            await utils.click(this.attachments.cancel);
            await this.page.waitForSelector(this.attachments.noRecordsText);
        }
    }

    // This function is used to delete the existing files and verifying confirmation of "Yes" and "No" button
    async deleteAttachedFile(confirmation: string) {
        if (confirmation == "cancel") {
            await this.page.locator(this.attachments.deleteIcon).first().click();
            await this.page.waitForSelector(this.attachments.confirmationPopup);
            expect(await this.page.locator(this.attachments.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.getByRole('button', { name: /^\s*No, Cancel\s*$/i }).click();
            expect(this.page.locator(this.attachments.attachemtRow).first()).toBeVisible();
        }
        else {
            await this.page.locator(this.attachments.deleteIcon).first().click();
            await this.page.waitForSelector(this.attachments.confirmationPopup);
            expect(await this.page.locator(this.attachments.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.locator(this.attachments.popupDeleteButton).click();
            expect(this.page.locator(this.attachments.attachemtRow).first()).not.toBeVisible();
        }
    };
}