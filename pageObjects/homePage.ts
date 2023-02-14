import { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly addToCart: string;
    readonly shoppingCart: string;
    readonly inventoryContainer: string;
    readonly remove: string;
    readonly itemsCountInCart: string;

    constructor(page: Page) {
        this.page = page;
        this.addToCart = "Add to cart";
        this.remove = "Remove";
        this.shoppingCart = ".shopping_cart_link";
        this.inventoryContainer = "#inventory_container";
        this.itemsCountInCart = ".shopping_cart_badge";
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
}