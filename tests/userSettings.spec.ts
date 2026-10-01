import test, { expect } from "@playwright/test";
import LoginPage from "../pom/pages/Login.page";
import BasePage from "../pom/BasePage.page";
import Dashboard from "../pom/pages/Dashboard.page";
import CreateNewRepository from "../pom/pages/CreateNewRepository.page";
import Repository from "../pom/pages/Repository.page";
import { faker } from "@faker-js/faker";
import RegisterPage from "../pom/pages/Register.page";
import UserSettings from "../pom/pages/userSettings.page";
import UserProfile from "../pom/pages/userProfile.page";

test.describe('Actions on user settings page', () => {
    let loginPage: LoginPage;
    let registerPage: RegisterPage;
    let basePage: BasePage;
    let dashboard: Dashboard;
    let createNewRepository: CreateNewRepository;
    let repository: Repository;
    let userSettings: UserSettings;
    let userProfile: UserProfile;

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
        userSettings = new UserSettings(page);
        userProfile = new UserProfile(page);

        await loginPage.goto();
        await loginPage.login(testUserEmail, testUserPassword)
    })

    test('Edit username', async () => {
        const updatedUsername = `${testUsername}_upd`;

        await dashboard.profileAndSettingsButton.click();
        await dashboard.userSettingsOption.click();
        await userSettings.updateUsername(updatedUsername);
        await dashboard.profileAndSettingsButton.click();
        await dashboard.userProfileOption.click();
        await expect(userProfile.username).toHaveText(updatedUsername);
        //update username to the original value
        await dashboard.profileAndSettingsButton.click();
        await dashboard.userSettingsOption.click();
        await userSettings.updateUsername(testUsername);
        await dashboard.profileAndSettingsButton.click();
        await dashboard.userProfileOption.click();
        await expect(userProfile.username).toHaveText(testUsername);
    })

    test('add full name', async () => {
        const fullName = `${faker.person.fullName()}`;

        await dashboard.profileAndSettingsButton.click();
        await dashboard.userSettingsOption.click();
        await userSettings.addFullName(fullName);
        await dashboard.profileAndSettingsButton.click();
        await dashboard.userProfileOption.click();
        await expect(userProfile.fullName).toHaveText(fullName);
    });
});