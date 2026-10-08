import { Locator } from "@playwright/test";
import BasePage from "../BasePage.page";
import { Urls } from "../../test-data/urls.data";
import { step } from "../../utils/decorators/step";

export default class CreateNewRepository extends BasePage {
    public readonly url: string = Urls.CREATE_NEW_REPOSITORY_PAGE;
    public readonly repositoryNameInput: Locator = this.page.locator('#repo_name');
    public readonly createRepositoryButton: Locator = this.page.locator('.ui.primary.button', { hasText: "Create Repository" })
    public readonly repositoryDescriptionInput: Locator = this.page.locator('#description');
    public readonly repositoryGitignoreInput: Locator = this.page.locator('.ui.multiple.search.selection.dropdown');
    public readonly repositoryGitignoreDropdown: Locator = this.page.locator('.menu.visible.transition');
    public readonly repositoryGitignoreDropdownItem: Locator = this.page.locator('.menu.visible.transition .item');

    @step('Create repository: {name}')
    async createRepository(name: string, options?: { description?: string, gitignore?: string }) {
        await this.repositoryNameInput.fill(name);
        if (options?.description) {
            await this.repositoryDescriptionInput.fill(options.description);
        }
        if (options?.gitignore) {
            await this.repositoryGitignoreInput.click();
            await this.repositoryGitignoreDropdownItem.filter({ hasText: options.gitignore }).first().click();
        }
        await this.createRepositoryButton.click();
    }
}