import { Locator } from "@playwright/test";
import BasePage from "../BasePage.page";
import { Urls } from "../../test-data/urls.data";
import Repository from "./Repository.page";

export default class CreateNewRepository extends BasePage {
    public readonly url: string = Urls.CREATE_NEW_REPOSITORY_PAGE;
    public readonly repositoryNameInput: Locator = this.page.locator('#repo_name');
    public readonly createRepositoryButton: Locator = this.page.locator('.ui.primary.button', { hasText: "Create Repository" })

    async createRepository(name: string) {
        await this.repositoryNameInput.fill(name);
        await this.createRepositoryButton.click();
    }
}