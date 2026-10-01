import test, { expect } from "@playwright/test";
import LoginPage from "../pom/pages/Login.page";
import BasePage from "../pom/BasePage.page";
import Dashboard from "../pom/pages/Dashboard.page";
import { Urls } from "../test-data/urls.data";
import CreateNewRepository from "../pom/pages/CreateNewRepository.page";
import Repository from "../pom/pages/Repository.page";
import { toPartialValueRegExp } from "../utils/toPartialValueRegExp";
import { faker } from "@faker-js/faker";
import RegisterPage from "../pom/pages/Register.page";

test.describe('Actions with repositories', () => {
    let loginPage: LoginPage;
    let registerPage: RegisterPage;
    let basePage: BasePage;
    let dashboard: Dashboard;
    let createNewRepository: CreateNewRepository;
    let repository: Repository;

    const testUsername = faker.internet.username();
    const testUserEmail = faker.internet.email();
    const testUserPassword = faker.internet.password({ length: 8 });

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(testUsername, testUserEmail, testUserPassword, testUserPassword);
        await page.close();
        await context.close();
    })

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        basePage = new BasePage(page);
        dashboard = new Dashboard(page);
        repository = new Repository(page);
        createNewRepository = new CreateNewRepository(page);

        await loginPage.goto();
        await loginPage.login(testUserEmail, testUserPassword)
    })

    test('Create new repository with valid name from Header', async ({ page }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;

        await dashboard.createNewHeaderDropdown.click();
        await dashboard.createNewRepositoryHeaderButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.createRepository(repositoryName);
        await repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(page).toHaveURL(repository.url);
        await expect(repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName));
        //await repository.deleteRepository();  //commented for now to have more test data for isolated tests, will be updated in future 
    })

    test('Create new repository with empty repository name from Header', async ({ page }) => {
        await dashboard.createNewHeaderDropdown.click();
        await dashboard.createNewRepositoryHeaderButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.createRepository('');
        await createNewRepository.validateEmptyMessage(createNewRepository.repositoryNameInput);
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
    })

    test('Create new repository with valid name from side menu', async ({ page }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;

        await dashboard.createNewRepositorySideMenuButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.createRepository(repositoryName);
        await repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(page).toHaveURL(repository.url);
        await expect(repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName));
        //await repository.deleteRepository(); //commented for now to have more test data for isolated tests, will be updated in future
    })

    test('Create new repository with empty repository name from side menu', async ({ page }) => {
        await dashboard.createNewRepositorySideMenuButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.createRepository('');
        await createNewRepository.validateEmptyMessage(createNewRepository.repositoryNameInput);
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
    })

    test('Create new repository with description and confirm that description is set', async ({ page }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;
        let repositoryDescription = `Description for ${repositoryName}`;

        await dashboard.createNewHeaderDropdown.click();
        await dashboard.createNewRepositoryHeaderButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.repositoryNameInput.fill(repositoryName);
        await createNewRepository.repositoryDescriptionInput.fill(repositoryDescription);
        await createNewRepository.createRepository(repositoryName, { description: repositoryDescription });
        await repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(page).toHaveURL(repository.url);
        await expect(repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName)); await repository.settingsButton.click();
        await expect(repository.repositoryDescriptionInput).toHaveValue(repositoryDescription);
        //await repository.deleteRepository();  //commented for now to have more test data for isolated tests, will be updated in future
    })

    test('Create new repository with gitignore and confirm that gitignore is set', async ({ page }) => {
        let repositoryName = `automation_repo_${faker.internet.username()}_${Date.now()}`;
        let repositoryDescription = `Description for ${repositoryName}`;
        let gitignore = 'Android';

        await dashboard.createNewHeaderDropdown.click();
        await dashboard.createNewRepositoryHeaderButton.click();
        await expect(page).toHaveURL(Urls.CREATE_NEW_REPOSITORY_PAGE);
        await createNewRepository.repositoryNameInput.fill(repositoryName);
        await createNewRepository.repositoryDescriptionInput.fill(repositoryDescription);
        await createNewRepository.createRepository(repositoryName, { gitignore: gitignore });
        await repository.setRepositoryUrl(testUsername, repositoryName);
        await expect(page).toHaveURL(repository.url);
        await expect(repository.repositoryName).toContainText(toPartialValueRegExp(repositoryName));
        await expect(repository.repositoryFilesTable).toContainText('.gitignore');
        //await repository.deleteRepository();  //commented for now to have more test data for isolated tests, will be updated in future
    })

    test('Filter repositories by name', async () => {
        const firstRepositoryInList = await dashboard.repositoryListFirstItem.textContent() ?? '';
        const filteredRepository = firstRepositoryInList.trim().split('/').pop()!;
        await expect(dashboard.repositoryList).toBeVisible();
        await dashboard.searchReposInput.fill(filteredRepository);
        await expect(dashboard.repositoryListItems).toHaveCount(1);
        await expect(dashboard.repositoryListItems).toContainText(filteredRepository)
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