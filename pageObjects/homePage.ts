import { Page, expect } from "@playwright/test";

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

}