import { test, expect } from "../utils/fixtures/app";
import { Urls } from "../test-data/urls.data";
import { toPartialValueRegExp } from "../utils/toPartialValueRegExp";
import { faker } from "@faker-js/faker";
import testUserData from "../test-data/users/testuser1.json";


test.describe('Actions with repositories with fixtures and storage state', () => {
    test.use({ storageState: '.states/testuser1.json' });

    //read from saved user data
    const testUsername = testUserData.username;

    test.beforeEach(async ({ app }) => {
        await app.dashboardPage.goto();
    })

    test('Create new repository with valid name from Header', async ({ app }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;

        await app.dashboardPage.createNewHeaderDropdown.click();
        await app.dashboardPage.createNewRepositoryHeaderButton.click();
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await app.createNewRepository.createRepository(repositoryName);
        await app.repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(app.page).toHaveURL(app.repository.url);
        await expect(app.repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName));
        //await repository.deleteRepository();  //commented for now to have more test data for isolated tests, will be updated in future 
    })

    test('Create new repository with empty repository name from Header', async ({ app }) => {
        await app.dashboardPage.createNewHeaderDropdown.click();
        await app.dashboardPage.createNewRepositoryHeaderButton.click();
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await app.createNewRepository.createRepository('');
        await app.createNewRepository.validateEmptyMessage(app.createNewRepository.repositoryNameInput);
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
    })

    test('Create new repository with valid name from side menu', async ({ app }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;

        await app.dashboardPage.createNewRepositorySideMenuButton.click();
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await app.createNewRepository.createRepository(repositoryName);
        await app.repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(app.page).toHaveURL(app.repository.url);
        await expect(app.repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName));
        //await repository.deleteRepository(); //commented for now to have more test data for isolated tests, will be updated in future
    })

    test('Create new repository with empty repository name from side menu', async ({ app }) => {
        await app.dashboardPage.createNewRepositorySideMenuButton.click();
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await app.createNewRepository.createRepository('');
        await app.createNewRepository.validateEmptyMessage(app.createNewRepository.repositoryNameInput);
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
    })

    test('Create new repository with description and confirm that description is set', async ({ app }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;
        let repositoryDescription = `Description for ${repositoryName}`;

        await app.dashboardPage.createNewHeaderDropdown.click();
        await app.dashboardPage.createNewRepositoryHeaderButton.click();
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await app.createNewRepository.repositoryNameInput.fill(repositoryName);
        await app.createNewRepository.repositoryDescriptionInput.fill(repositoryDescription);
        await app.createNewRepository.createRepository(repositoryName, { description: repositoryDescription });
        await app.repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(app.page).toHaveURL(app.repository.url);
        await expect(app.repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName)); await app.repository.settingsButton.click();
        await expect(app.repository.repositoryDescriptionInput).toHaveValue(repositoryDescription);
        //await repository.deleteRepository();  //commented for now to have more test data for isolated tests, will be updated in future
    })

    test('Create new repository with gitignore and confirm that gitignore is set', async ({ app }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;
        let repositoryDescription = `Description for ${repositoryName}`;
        let gitignore = 'Android';

        await app.dashboardPage.createNewHeaderDropdown.click();
        await app.dashboardPage.createNewRepositoryHeaderButton.click();
        await expect(app.page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await app.createNewRepository.repositoryNameInput.fill(repositoryName);
        await app.createNewRepository.repositoryDescriptionInput.fill(repositoryDescription);
        await app.createNewRepository.createRepository(repositoryName, { gitignore: gitignore });
        await app.repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(app.page).toHaveURL(app.repository.url);
        await expect(app.repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName));
        await expect(app.repository.repositoryFilesTable).toContainText('.gitignore');
        //await repository.deleteRepository();  //commented for now to have more test data for isolated tests, will be updated in future
    })

    test('Filter repositories by name', async ({ app }) => {
        const firstRepositoryInList = await app.dashboardPage.repositoryListFirstItem.textContent() ?? '';
        const filteredRepository = firstRepositoryInList.trim().split('/').pop()!;
        await expect(app.dashboardPage.repositoryList).toBeVisible();
        await app.dashboardPage.searchReposInput.fill(filteredRepository);
        await expect(app.dashboardPage.repositoryListItems).toHaveCount(1);
        await expect(app.dashboardPage.repositoryListItems).toContainText(filteredRepository)
    })

    //afterAll is commented as it requires more work to be working correctly in all cases

    // test.afterAll('Delete all created repositories', async () => {
    //     let reposList: string[];
    //     let reposCount: number;

    //     await expect(dashboardPage.repositoryList).toBeVisible();
    //     reposList = await dashboardPage.repositoryListItems.allTextContents();
    //     reposCount = await dashboardPage.repositoryListItems.count();
    //     for (let i = reposCount - 1; i >= 0; i--) {
    //         if (!reposList[i].includes(existingRepositoryData.repositoryName)) {
    //             await dashboardPage.repositoryListItems.nth(i).click();
    //             await repository.deleteRepository();
    //             console.log(`Repository ${reposList[i]} was deleted`);
    //         } else {
    //             console.log(`Repository ${reposList[i]} was NOT deleted`);
    //         }
    //     }
    // })
})