import { Page } from "@playwright/test";

export default class BasePage {
    protected readonly page: Page;
    url: string;


    constructor(page: Page) {
        this.page = page;
        this.url = '';
    }

    async goto() {
        await this.page.goto(this.url);
    }
}

