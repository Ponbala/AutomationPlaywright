import { Page, expect } from "@playwright/test";
import { Registration } from '../support/constants.json';
import { CartPage } from "../pageObjects/cartPage";
import { RegisterPage } from "../pageObjects/registerPage";

let cartPage: CartPage, registerPage: RegisterPage;

export class HomePage {
    readonly page: Page;
    readonly addToCart: string;
    readonly shoppingCart: string;
    readonly inventoryContainer: string;
    readonly remove: string;
    readonly itemsCountInCart: string;
    readonly sortingDropdown: string;
    readonly activeOption: string;

    constructor(page: Page) {
        this.page = page;
        cartPage = new CartPage(page);
        registerPage = new RegisterPage(page);
        this.addToCart = "Add to cart";
        this.remove = "Remove";
        this.shoppingCart = ".shopping_cart_link";
        this.inventoryContainer = "#inventory_container";
        this.itemsCountInCart = ".shopping_cart_badge";
        this.sortingDropdown = ".product_sort_container";
        this.activeOption = ".active_option";
    }

    async getBaseURL() {
        await this.page.goto('/');
    }

    async clickAddToCart() {
        await this.page.getByText(this.addToCart).first().click();
    };

    async addItemsToCart(itemsCount: number) {
        for (let i = 1; i <= itemsCount; i++) {
            await this.clickAddToCart();
        }
    }

    async clickRemove() {
        await this.page.getByText(this.remove).first().click({ delay: 2000 });
    };

    async removeItemsFromCart(removeCount: number) {
        for (let i = 1; i <= removeCount; i++) {
            await this.clickRemove();
        }
    }

    async getRemoveItemsCount() {
        return await this.page.getByText(this.remove).count();
    }

    async getItemsCountElement() {
        return this.page.locator(this.itemsCountInCart);
    }

    async getItemsCountInCart() {
        return await (await this.getItemsCountElement()).textContent();
    }

    async clickShoppingCartAndFillRegistrationValues() {
        await (await this.page.waitForSelector(this.shoppingCart)).waitForElementState("stable");
        await this.page.locator(this.shoppingCart).click({ force: true });
        expect(this.page.locator(cartPage.cartContainer)).toBeVisible();
        await cartPage.clickCheckout();
        await registerPage.fillRegistrationFieldValues(Registration.firstName, Registration.lastName, Registration.postalCode);
    };

    async getInventoryContainerElement() {
        return this.inventoryContainer;
    };

    async clickSortDropdown() {
        await this.page.locator(this.sortingDropdown).click();
    }

    async selectSortOptionAndGetValue(optionValue: string) {
        await this.page.locator(this.sortingDropdown).selectOption(optionValue);
        return await this.getValueText(optionValue);
    }

    async getValueText(option: string) {
        let selectedOption: string | null;
        switch (option) {
            case "az":
                selectedOption = await this.getActiveOptionText();
                console.log("The selected option is " + selectedOption + " filter");
                return selectedOption;
            case "za":
                selectedOption = await this.getActiveOptionText();
                console.log("The selected option is " + selectedOption + " filter");
                return selectedOption;
            case "lohi":
                selectedOption = await this.getActiveOptionText();
                console.log("The selected option is " + selectedOption + " filter");
                return selectedOption;
            case "hilo":
                selectedOption = await this.getActiveOptionText();
                console.log("The selected option is " + selectedOption + " filter");
                return selectedOption;
        }
    }

    async getActiveOptionText() {
        return await this.page.locator(this.activeOption).textContent();
    }

    async sortAllOptions(values: any, optionText: any) {
        for (const option of values) {
            const index = values.indexOf(option);
            const sortedOption = await this.selectSortOptionAndGetValue(option);
            expect(sortedOption).toEqual(optionText[index]);
        }
    }
}