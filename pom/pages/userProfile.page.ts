import { Locator } from "@playwright/test";
import BasePage from "../BasePage.page";

export default class UserProfile extends BasePage {
    public readonly username: Locator = this.page.locator('.profile-avatar-name .username');
    public readonly fullName: Locator = this.page.locator('.profile-avatar-name .header');
}