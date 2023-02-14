import { Page } from "@playwright/test";
import { HomePage } from "./homePage";

let homePage: HomePage;

export class LoginPage {
    readonly page: Page;
    readonly userName: string;
    readonly password: string;
    readonly loginButton: string;
    readonly title: string;
    readonly menu: string;
    readonly logoutEle: string;
    readonly loginContainer: string;
    readonly errorMsg: string;

    constructor(page: Page) {
        this.page = page;
        homePage = new HomePage(this.page);
        this.userName = '#user-name';
        this.password = '#password';
        this.loginButton = '#login-button';
        this.title = '.title';
        this.menu = '#react-burger-menu-btn';
        this.logoutEle = '#logout_sidebar_link';
        this.loginContainer = '.login_wrapper-inner';
        this.errorMsg = 'h3';
    }

    async getUserNameElement() {
        await this.page.waitForSelector(this.userName);
        return this.userName;
    };

    async getPasswordElement() {
        await this.page.waitForSelector(this.password);
        return this.password;
    };

    async fillUsrNameAndPwd(userName: string, password: string) {
        let getUserNameEle = await this.getUserNameElement();
        await this.page.locator(getUserNameEle).fill(userName);
        await this.page.locator(await this.getPasswordElement()).fill(password);
    }

    async clickLogin() {
        await this.page.waitForSelector(this.loginButton);
        await this.page.locator(this.loginButton).click();
    };

    async getTitleText() {
        await this.page.waitForSelector(this.title);
        return await this.page.locator(this.title).textContent();
    };

    async clickMenu() {
        await this.page.waitForSelector(this.menu);
        await this.page.locator(this.menu).click();
    };

    async clickLogout() {
        await (await this.page.waitForSelector(this.logoutEle)).waitForElementState("enabled");
        await this.page.locator(this.logoutEle).click();
    };

    async logout() {
        await this.clickMenu();
        await this.clickLogout();
    };

    async getErrorMsg() {
        await this.page.waitForSelector(this.errorMsg);
        return await this.page.locator(this.errorMsg).textContent();
    }
}