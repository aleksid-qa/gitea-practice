import { expect, Locator } from "@playwright/test";
import BasePage from "../BasePage.page";
import { Urls } from "../../test-data/urls.data";
import { RepositoryMessages } from "../../test-data/messages/repository-messages.data";
import Dashboard from "./Dashboard.page";
import { alreadyRegisteredData } from "../../test-data/register.data";
import { step } from "../../utils/decorators/step";

export default class Repository extends BasePage {
    public readonly repositoryName: Locator = this.page.locator('.flex-text-block.tw-flex-wrap.tw-text-18>a').last();
    public readonly settingsButton: Locator = this.page.locator('[data-text="Settings"]');
    public readonly deleteRepositoryButton: Locator = this.page.locator('[data-modal="#delete-repo-modal"]', { hasText: "Delete This Repository" });
    public readonly deleteRepositoryPopUp: Locator = this.page.locator('#delete-repo-modal');
    public readonly repositoryNameInput: Locator = this.page.locator('#_aria_label_input_32');
    public readonly deleteRepositoryPopUpNameInput: Locator = this.page.locator('#_aria_label_input_36');
    public readonly deleteRepositoryConfirmationButton: Locator = this.page.locator('.ok.button', { hasText: "Delete Repository" });
    public readonly repositoryDeletedSuccessMessage: Locator = this.page.locator('.flash-success>div', { hasText: RepositoryMessages.REPOSITORY_DELETED });
    public readonly repositoryDescriptionInput: Locator = this.page.locator('#description');
    public readonly repositoryFilesTable: Locator = this.page.locator('#repo-files-table');

    @step('Set repository URL for {username}/{name}')
    async setRepositoryUrl(username: string, name: string) {
        this.url = Urls.REPOSITORY_PAGE(username, name);
    }

    @step('Delete the current repository')
    async deleteRepository() {
        const dashboard = new Dashboard(this.page);
        let repositoryName: string;

        await this.settingsButton.click();
        repositoryName = await this.repositoryNameInput.inputValue();
        await expect(this.page).toHaveURL(`${alreadyRegisteredData.username}/${repositoryName}/settings`);
        await this.deleteRepositoryButton.click();
        await expect(this.deleteRepositoryPopUp).toBeVisible();
        await this.deleteRepositoryPopUpNameInput.fill(repositoryName);
        await this.deleteRepositoryConfirmationButton.click();
        await expect(this.page).toHaveURL(dashboard.url);
        await expect(this.repositoryDeletedSuccessMessage).toBeVisible();
    }
}