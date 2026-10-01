import { expect, Locator } from "@playwright/test";
import BasePage from "../BasePage.page";
import { userSettingsMessages } from "../../test-data/messages/userSettings-messages.data";

export default class UserSettings extends BasePage {
    public readonly usernameInput: Locator = this.page.locator('#username');
    public readonly fullNameInput: Locator = this.page.locator('#full_name');
    public readonly updateProfileButton: Locator = this.page.locator('.ui.primary.button', { hasText: 'Update Profile' });
    public readonly usernameUpdateWarningMessage: Locator = this.page.locator('#name-change-prompt', { hasText: userSettingsMessages.USERNAME_UPDATE_WARNING });
    public readonly profileUpdatedMessage: Locator = this.page.locator('.flash-success>div', { hasText: userSettingsMessages.PROFILE_UPDATED });

    async updateUsername(username: string) {
        await this.usernameInput.fill(username);
        await expect(this.usernameUpdateWarningMessage).toBeVisible();
        await this.updateProfileButton.click();
        await expect(this.profileUpdatedMessage).toBeVisible();
    }

    async addFullName(fullName: string) {
        await this.fullNameInput.fill(fullName);
        await this.updateProfileButton.click();
        await expect(this.profileUpdatedMessage).toBeVisible();
    }
}