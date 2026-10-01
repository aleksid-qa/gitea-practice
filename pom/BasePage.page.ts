import { expect, Locator, Page } from "@playwright/test";

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

    async validateEmptyMessage(locator: Locator) {
        await expect(locator).toHaveJSProperty('validity.valueMissing', true);
        const message = await locator.evaluate(el => (el as HTMLInputElement).validationMessage)
        expect(message).toMatch(/Please fill (in|out) this field\./);
    }
}

