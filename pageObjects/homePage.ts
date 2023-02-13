import { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly addToCart: string;
    readonly shoppingCart: string;
    readonly inventoryContainer: string;

    constructor(page: Page) {
        this.page = page;
        this.addToCart = "'Add to cart'";
        this.shoppingCart = '.shopping_cart_link';
        this.inventoryContainer = '#inventory_container';
    }

    async clickAddToCart(index: number) {
        // await this.page.waitForSelector(this.loginButton);
        await this.page.locator(this.addToCart).nth(index).click();
    };

    async clickShoppingCart() {
        await this.page.waitForSelector(this.shoppingCart);
        await this.page.locator(this.shoppingCart).click();
    };

    async getInventoryContainerElement() {
        return this.inventoryContainer;
    };
}
