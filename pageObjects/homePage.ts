import { Page } from "@playwright/test";

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

    async clickShoppingCart() {
        await (await this.page.waitForSelector(this.shoppingCart)).waitForElementState("stable");
        await this.page.locator(this.shoppingCart).click({ force: true });
    };

    async getInventoryContainerElement() {
        return this.inventoryContainer;
    };

    async clickSortDropdown() {
        await this.page.locator(this.sortingDropdown).click();
    }

    async selectSortOption(optionValue: string) {
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
}