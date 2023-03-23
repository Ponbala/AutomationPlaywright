import { Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly loginElements: any;

    constructor(page: Page) {
        this.page = page;
        this.loginElements = {
            userName: '[name="username"]',
            password: '[name="password"]',
            loginButton: '[type="submit"]'
        }
    }

    // This function is used to "launch the application base url"
    async getBaseURL() {
        await this.page.goto('/');
    }

    // This function is used to get the "Username" element
    async getUserNameElement() {
        await this.page.waitForSelector(this.loginElements.userName);
        return this.loginElements.userName;
    };

    // This function is used to get the "Password" element
    async getPasswordElement() {
        await this.page.waitForSelector(this.loginElements.password);
        return this.loginElements.password;
    };

    // This function is used to get the "Password" element
    async fillUsrNameAndPwdAndLogin(userName: string, password: string) {
        let getUserNameElem = await this.getUserNameElement();
        await this.page.locator(getUserNameElem).fill(userName);
        await this.page.locator(await this.getPasswordElement()).fill(password);
        await this.clickLogin();
    }

    // This function is used to click on the "Login" button
    async clickLogin() {
        await this.page.waitForSelector(this.loginElements.loginButton);
        await this.page.locator(this.loginElements.loginButton).click();
    };
}