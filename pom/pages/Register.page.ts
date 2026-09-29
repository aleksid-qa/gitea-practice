import { expect, Locator } from "@playwright/test";
import { Urls } from "../../test-data/urls.data";
import BasePage from "../BasePage.page";
import { RegisterMessages } from "../../test-data/messages/register-messages.data";

export default class RegisterPage extends BasePage {
    public url: string = Urls.REGISTER_PAGE;
    public readonly usernameInput: Locator = this.page.locator('#user_name');
    public readonly emailInput: Locator = this.page.locator('#email');
    public readonly passwordInput: Locator = this.page.locator('#password');
    public readonly confirmPasswordInput: Locator = this.page.locator('#retype');
    private readonly registerButton: Locator = this.page.locator('.ui.primary.button');
    public readonly errorPasswordsNotMatch: Locator = this.page.locator('.flash-error', { hasText: RegisterMessages.PASSWORDS_DO_NOT_MATCH });
    public readonly errorPasswordTooShort: Locator = this.page.locator('.flash-error', { hasText: RegisterMessages.PASSWORD_TOO_SHORT });
    public readonly errorUsernameTaken: Locator = this.page.locator('.flash-error', { hasText: RegisterMessages.USERNAME_TAKEN });
    public readonly errorUsernameInvalid: Locator = this.page.locator('.flash-error', { hasText: RegisterMessages.USERNAME_INVALID });
    public readonly errorEmailTaken: Locator = this.page.locator('.flash-error', { hasText: RegisterMessages.EMAIL_TAKEN });

    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async enterConfirmPassword(password: string) {
        await this.confirmPasswordInput.fill(password);
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async register(username: string, email: string, password: string, confirmPassword: string) {
        await this.usernameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.registerButton.click();
    }

    async expectFieldsInvalidStyle(...locators: Locator[]) {
        for (const locator of locators) {
            await expect(locator).toHaveCSS('background-color', 'rgb(255, 235, 233)');
            await expect(locator).toHaveCSS('border-color', 'rgba(255, 129, 130, 0.4)');
        }
    }
}