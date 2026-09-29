import test, { expect } from "@playwright/test";
import LoginPage from "../pom/pages/Login.page";
import BasePage from "../pom/BasePage.page";
import Dashboard from "../pom/pages/Dashboard.page";
import { alreadyRegisteredData } from "../test-data/register.data";
import { Urls } from "../test-data/urls.data";
import CreateNewRepository from "../pom/pages/CreateNewRepository.page";
import { existingRepositoryData, validRepositoryData } from "../test-data/repository.data";
import Repository from "../pom/pages/Repository.page";
import { toPartialValueRegExp } from "../utils/toPartialValueRegExp";
import { faker } from "@faker-js/faker";

test.describe('Actions with repositories', () => {
    let loginPage: LoginPage;
    let basePage: BasePage;
    let dashboard: Dashboard;
    let createNewRepository: CreateNewRepository;
    let repository: Repository;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        basePage = new BasePage(page);
        dashboard = new Dashboard(page);
        repository = new Repository(page);
        createNewRepository = new CreateNewRepository(page);
        await loginPage.goto();
        await loginPage.login(alreadyRegisteredData.email, alreadyRegisteredData.password)
    })

    test('Create new repository from Header and delete it afterwards', async ({ page }) => {
        let repositoryName = `${faker.internet.username()}_${Date.now()}`;

        await dashboard.createNewHeaderDropdown.click();
        await dashboard.createNewRepositoryHeaderButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.createRepository(repositoryName);
        await repository.setRepositoryUrl(alreadyRegisteredData.username, repositoryName);
        await expect(page).toHaveURL(repository.url);
        await expect(repository.repositoryCloneUrlInput).toHaveValue(toPartialValueRegExp(repositoryName));
        await repository.deleteRepository();
    })

    test('Create new repository from side menu and delete it afterwards', async ({ page }) => {
        await dashboard.createNewRepositorySideMenuButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.createRepository(validRepositoryData.repositoryName);
        await repository.setRepositoryUrl(alreadyRegisteredData.username, validRepositoryData.repositoryName);
        await expect(page).toHaveURL(repository.url);
        await expect(repository.repositoryCloneUrlInput).toHaveValue(toPartialValueRegExp(validRepositoryData.repositoryName));
        await repository.deleteRepository();
    })

    test('Filter repositories by name', async () => {
        let matchingReposCount: number;

        await expect(dashboard.repositoryList).toBeVisible();
        matchingReposCount = await dashboard.repositoryListItems.filter({ hasText: existingRepositoryData.repositoryName }).count();
        await dashboard.searchReposInput.fill(existingRepositoryData.repositoryName);
        await expect(dashboard.repositoryListItems).toHaveCount(matchingReposCount);
        await expect(dashboard.repositoryListItems).toContainText(existingRepositoryData.repositoryName)
    })

    //afterAll is commented as it requires more work to be working correctly in all cases

    // test.afterAll('Delete all created repositories', async () => {
    //     let reposList: string[];
    //     let reposCount: number;

    //     await expect(dashboard.repositoryList).toBeVisible();
    //     reposList = await dashboard.repositoryListItems.allTextContents();
    //     reposCount = await dashboard.repositoryListItems.count();
    //     for (let i = reposCount - 1; i >= 0; i--) {
    //         if (!reposList[i].includes(existingRepositoryData.repositoryName)) {
    //             await dashboard.repositoryListItems.nth(i).click();
    //             await repository.deleteRepository();
    //             console.log(`Repository ${reposList[i]} was deleted`);
    //         } else {
    //             console.log(`Repository ${reposList[i]} was NOT deleted`);
    //         }
    //     }
    // })

})