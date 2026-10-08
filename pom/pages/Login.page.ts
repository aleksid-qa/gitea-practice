import { Locator } from "@playwright/test";
import BasePage from "../BasePage.page";
import { Urls } from "../../test-data/urls.data";
import { step } from "../../utils/decorators/step";

export default class LoginPage extends BasePage {
    public readonly url: string = Urls.LOGIN_PAGE;
    public readonly usernameInput: Locator = this.page.locator('#user_name');
    public readonly passwordInput: Locator = this.page.locator('#password');
    public readonly loginButton: Locator = this.page.locator('.ui.primary.button');

    @step('Log in with username: {username}')
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}