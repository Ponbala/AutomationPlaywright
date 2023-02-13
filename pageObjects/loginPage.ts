import { Page } from "@playwright/test";
import { HomePage } from "./homePage";

let homePage:HomePage;

export class LoginPage {
    readonly page: Page;
    readonly userName: string;
    readonly password: string;
    readonly loginButton: string;
    readonly title: string;
    readonly menu: string;
    readonly logout: string;
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
        this.logout = '#logout_sidebar_link';
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

    async clickLogin() {
        await this.page.waitForSelector(this.loginButton);
        await this.page.locator(this.loginButton).click();
        // const inventoryContainerEle = await homePage.getInventoryContainerElement();
        // await this.page.waitForSelector(inventoryContainerEle);
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
        await this.page.waitForSelector(this.logout);
        await this.page.locator(this.logout).click();
    };

    async getErrorMsg(){
        await this.page.waitForSelector(this.errorMsg);
        return await this.page.locator(this.errorMsg).textContent();
    }
}