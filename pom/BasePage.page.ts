import { expect, Locator, Page } from "@playwright/test";
import { step } from "../utils/decorators/step";

export default class BasePage {
    protected readonly page: Page;
    url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = '';
    }

    @step('Navigate to the current page')
    async goto() {
        await this.page.goto(this.url);
    }

    @step('Validate required-field message')
    async validateEmptyMessage(locator: Locator) {
        await expect(locator).toHaveJSProperty('validity.valueMissing', true);
        const message = await locator.evaluate(el => (el as HTMLInputElement).validationMessage)
        expect(message).toMatch(/Please fill (in|out) this field\./);
    }
}

