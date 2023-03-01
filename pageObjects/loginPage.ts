import { Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly userName: string;
    readonly password: string;
    readonly loginButton: string;
    readonly myInfo: string;

    constructor(page: Page) {
        this.page = page;
        this.userName = '[name="username"]';
        this.password = '[name="password"]';
        this.loginButton = '[type="submit"]';
        this.myInfo = '//span[text()="My Info"]';
    }

    async getBaseURL() {
        await this.page.goto('/');
    }

    async getUserNameElement() {
        await this.page.waitForSelector(this.userName);
        return this.userName;
    };

    async getPasswordElement() {
        await this.page.waitForSelector(this.password);
        return this.password;
    };

    async fillUsrNameAndPwdAndLogin(userName: string, password: string) {
        let getUserNameEle = await this.getUserNameElement();
        await this.page.locator(getUserNameEle).fill(userName);
        await this.page.locator(await this.getPasswordElement()).fill(password);
        await this.clickLogin();
    }

    async clickLogin() {
        await this.page.waitForSelector(this.loginButton);
        await this.page.locator(this.loginButton).click();
    };

    async clickMyInfoMenu() {
        await this.page.waitForSelector(this.myInfo);
        await this.page.getByRole('link', { name: 'My Info' }).click();
    };
}