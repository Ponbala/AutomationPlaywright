import { chromium, firefox, webkit, Page, expect } from '@playwright/test';
import { HomePage } from '../pageObjects';
import { DirectoryPage } from "../pageObjects/directoryPage";
import Constants from "../support/constants.json";

let directoryPage: DirectoryPage;
let homePage: HomePage;

export class Utils {

  readonly page: Page;
  readonly backgroundContainer: string;
  readonly toastElements: any;
  readonly save: string;
  readonly tableRow: string;
  readonly attachments: any;
  readonly editIcon: string;

  constructor(page: Page) {
    this.page = page;
    homePage = new HomePage(page);
    directoryPage = new DirectoryPage(page);
    this.backgroundContainer = '.orangehrm-background-container';
    this.save = 'button.oxd-button--medium';
    this.toastElements = {
      toastMessage: 'p.oxd-text--toast-message',
      closeIcon: '.oxd-toast-close-container'
    }
    this.attachments = {
      deleteSelectedButton: 'button.orangehrm-horizontal-margin',
      deleteIcon: 'i.oxd-icon.bi-trash',
      confirmationPopup: 'div.orangehrm-dialog-popup',
      popupDeleteButton: '(//div[@class="orangehrm-modal-footer"]//button)[2]'
    }
    this.tableRow = "//div[@class='oxd-table-card']/div[@role='row']";
    this.editIcon = ".oxd-icon.bi-pencil-fill";
  }

  async launchBrowsers() {
    const browsers = await Promise.all([
      chromium.launch(),
      firefox.launch(),
      webkit.launch(),
    ]);
  }

  async waitForSpinnerToDisappear() {
    const spinner = await this.page.waitForSelector('.oxd-loading-spinner');
    await spinner.waitForElementState("hidden");
  }

  async logout() {
    await this.click(".oxd-userdropdown-tab");
    await this.page.getByRole("menuitem", { name: "Logout", exact: true }).click();
  }

  // This function is used to "clear" the "textbox" values
  async clearTextBoxValues(locatorValue: any) {
    await (await this.page.waitForSelector(locatorValue)).waitForElementState('editable');
    await this.page.locator(locatorValue).fill('');
  };


  // This function is used to fill the "textbox" values
  async fillTextBoxValues(locatorValue: any, fillValue: any) {
    await (await this.page.waitForSelector(locatorValue)).waitForElementState("editable");
    await this.page.locator(locatorValue).type(fillValue);
  };

  // This function is used to fill the "Date" textbox values
  async fillDateValue(locatorValue: any, fillValue: any) {
    await this.page.locator(locatorValue).fill(fillValue);
  };

  // This function is used to click the dropdown and "select the passed value"
  async selecDropdownOption(role: any, locator: any, optionValue: any) {
    await this.click(locator);
    await this.page.getByRole(role, { name: optionValue }).getByText(optionValue, { exact: true }).click();
  };

  // This function is used to click on the "Save" button
  async clickSave(locatorValue: string, index: number, messageToVerify?: string) {
    await this.page.locator(locatorValue).nth(index).click({ delay: 3000 });
    if (messageToVerify) {
      let toastMsg = await this.getToastMessage();
      expect(toastMsg).toEqual(messageToVerify);
      await this.clickCloseIcon();
    }
    // await utils.waitForSpinnerToDisappear();
    await this.page.waitForTimeout(3000);
  }

  // This function is used to "click on the element"
  async click(locator: any) {
    await (await this.page.waitForSelector(locator)).waitForElementState("stable");
    await this.page.locator(locator).click({ force: true });
  }

  // This function is used to "click on the element with index"
  async clickElementWithIndex(locatorValue, index) {
    await this.page.locator(locatorValue).nth(index).click();
  }

  // This function is used to filling the multiple textbox values using "for of" loop
  async fillFieldValues(locators: any, values: any) {
    for (const locator of locators) {
      await this.clearTextBoxValues(locator);
      const index = locators.indexOf(locator);
      await this.fillTextBoxValues(locator, values[index]);
      await this.page.waitForTimeout(1000);
    };
  }

  // This function is used to click on the "Close" Icon of the toast message
  async clickCloseIcon() {
    await (await this.page.waitForSelector(this.toastElements.closeIcon)).waitForElementState("stable");
    await this.page.locator(this.toastElements.closeIcon).click();
  }

  // This function returns the "toast message text"
  async getToastMessage() {
    return await this.page.locator(this.toastElements.toastMessage).textContent();
  }

  // This function is used to "copy and paste" the values from the any textbox elements
  async copyPaste(sourceLocator, destinationLocator) {
    await this.page.locator(sourceLocator).dblclick();
    await this.page.locator(sourceLocator).press('Control+C');
    await this.page.locator(destinationLocator).press('Control+V');
  }

  // This function is used to "get the text" of any elements
  async getText(locator) {
    return await this.page.locator(locator).textContent();
  }

  // This function is used to "click the element/link"
  async clickByRole(role, value) {
    await this.page.getByRole(role, { name: value, exact: true }).click();
    await this.page.waitForSelector(this.backgroundContainer);
  }

  // This function is used to "select the option" from "Auto suggestion"
  async clickOption(role, value) {
    await this.page.getByRole(role, { name: value }).getByText(value, { exact: true }).click();
  }

  // This function is used to "click on the My info sub menus"
  async clickMenu(role, locator, menuLinkText) {
    await this.page.waitForSelector(locator);
    await this.page.getByRole(role, { name: menuLinkText }).click();
    await (await this.page.waitForSelector(this.backgroundContainer)).waitForElementState("stable");
    // await this.page.waitForTimeout(3000);
  }

  async waitForContainer() {
    await this.page.waitForSelector(this.backgroundContainer);
  }

  async deleteUsers() {
    await this.clickMenu("link", homePage.homePageElements.pim, "PIM");
    await this.click("//a[text()='Employee List']");
    await this.fillTextBoxValues(directoryPage.directory.employeeName, "Test User");
    await this.click(directoryPage.directory.search);
    await this.page.waitForTimeout(5000);
    let tableRow = await this.page.locator("//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'Software Engineer')]").first().isVisible();
    console.log("tableRow", tableRow);
    if (tableRow) {
      await this.deleteRecords("Software Engineer");
    }
  }

  async deleteRecords(value) {
    // await (await this.page.waitForSelector(this.addReview.tableRow)).waitForElementState("stable");
    let row = this.page.locator(this.tableRow).first();
    let rowVisibility = await row.isVisible();
    console.log("rowVisibility", rowVisibility);
    if (rowVisibility) {
      let rows = this.page.locator("//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'User')]");
      console.log("rows", await rows.count());
      let rowsCount = await rows.count();
      for (let i = 0; i < rowsCount; i++) {
        let get = await this.getARow(value);
        await get.locator("../..//i[@class='oxd-icon bi-trash']").first().click();
        await this.page.waitForSelector(this.attachments.confirmationPopup);
        await this.page.locator(this.attachments.popupDeleteButton).click();
        let toastMsg = await this.getToastMessage();
        expect(toastMsg).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await this.clickCloseIcon();
        await this.waitForSpinnerToDisappear();
      }
    }
  }

  // This function is used to get the "specific row"
  async getARow(value) {
    await this.page.waitForSelector(`//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`);
    return this.page.locator(`//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`);
  }

  async createUsers(firstName, lastName, userName) {
    await this.clickMenu("link", homePage.homePageElements.pim, "PIM");
    await this.click("//a[text()='Add Employee']");
    await this.page.waitForTimeout(4000);
    await this.clearTextBoxValues("[name='firstName']");
    await this.fillTextBoxValues("[name='firstName']", firstName);
    await this.clearTextBoxValues("[name='lastName']");
    await this.fillTextBoxValues("[name='lastName']", lastName);
    await this.click('.oxd-switch-wrapper input');
    await this.fillTextBoxValues("//label[text()='Username']/../..//input", userName);
    await this.fillTextBoxValues("//label[text()='Password']/../..//input", "Testuser@12");
    await this.fillTextBoxValues("//label[text()='Confirm Password']/../..//input", "Testuser@12");
    // await myInfoPage.click("[type='submit]");
    await this.clickSave(this.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
    await this.click("//a[text()='Job']");
    await this.page.waitForTimeout(4000);
    await this.fillDateValue("//label[text()='Joined Date']/../..//input", "2023-03-10");
    await this.selecDropdownOption("option", "//label[text()='Job Title']/../..//div[@class='oxd-select-text-input']", "Software Engineer");
    await this.clickSave(this.save, 0);
  }

  async updatingUserRole(userName, userRole) {
    // await myInfoPage.click("[type='submit']");
    await this.clickMenu("link", homePage.homePageElements.admin, userRole);
    await this.fillTextBoxValues("//label[text()='Username']/../..//input", userName);
    await this.click("[type='submit']");
    await this.page.waitForTimeout(3000);
    await this.click(this.editIcon);
    await this.waitForContainer();
    await this.page.waitForTimeout(3000);
    // await myInfoPage.click("//label[text()='User Role']/../..//div[@class='oxd-select-text-input']");
    await this.selecDropdownOption("option", "//label[text()='User Role']/../..//div[@class='oxd-select-text-input']", "Admin");
    await this.clickSave(this.save, 1, Constants.sucessMsg.successfulUpdatedMsg);
  }
}