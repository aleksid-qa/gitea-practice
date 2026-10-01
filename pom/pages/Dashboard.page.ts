import { Locator } from "@playwright/test";
import BasePage from "../BasePage.page";
import { RegisterMessages } from "../../test-data/messages/register-messages.data";

export default class Dashboard extends BasePage {
    public readonly organizationDropdown: Locator = this.page.locator('.gt-ellipsis').first();
    public readonly accountCreatedSuccessMessage: Locator = this.page.locator('.ui.positive.message', { hasText: RegisterMessages.SUCCESS });
    public readonly createNewHeaderDropdown: Locator = this.page.locator('.ui.dropdown.jump[data-tooltip-content="Create…"]');
    public readonly createNewRepositoryHeaderButton: Locator = this.page.locator('#_aria_dropdown_item_2');
    public readonly createNewRepositorySideMenuButton: Locator = this.page.locator('[data-tooltip-content="New Repository"]');
    public readonly searchReposInput: Locator = this.page.locator('[type="search"]');
    public readonly repositoryList: Locator = this.page.locator('.repo-owner-name-list');
    public readonly repositoryListItems: Locator = this.page.locator('.repo-owner-name-list>li');
    public readonly repositoryListFirstItem: Locator = this.page.locator('.repo-owner-name-list>li').first();
    public readonly profileAndSettingsButton: Locator = this.page.locator('[data-tooltip-content="Profile and Settings…"]');
    public readonly userProfileOption: Locator = this.page.locator('.user-menu>a', { hasText: 'Profile' });
    public readonly userSettingsOption: Locator = this.page.locator('.user-menu>a', { hasText: 'Settings' });
}