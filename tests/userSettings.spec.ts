import { test, expect } from "../utils/fixtures/app";
import { faker } from "@faker-js/faker";
import testUserData from "../test-data/users/testuser1.json";

test.describe('Actions on user settings page', () => {
    test.use({ storageState: '.states/testuser1.json' });

    const testUsername = testUserData.username;

    test.beforeEach(async ({ app }) => {
        await app.dashboardPage.goto();
    })

    test('Edit username', async ({ app }) => {
        const updatedUsername = `${testUsername}_upd`;

        await app.dashboardPage.profileAndSettingsButton.click();
        await app.dashboardPage.userSettingsOption.click();
        await app.userSettings.updateUsername(updatedUsername);
        await app.dashboardPage.profileAndSettingsButton.click();
        await app.dashboardPage.userProfileOption.click();
        await expect(app.userProfile.username).toHaveText(updatedUsername);
        //update username to the original value
        await app.dashboardPage.profileAndSettingsButton.click();
        await app.dashboardPage.userSettingsOption.click();
        await app.userSettings.updateUsername(testUsername);
        await app.dashboardPage.profileAndSettingsButton.click();
        await app.dashboardPage.userProfileOption.click();
        await expect(app.userProfile.username).toHaveText(testUsername);
    })

    test('add full name', async ({ app }) => {
        const fullName = `${faker.person.fullName()}`;

        await app.dashboardPage.profileAndSettingsButton.click();
        await app.dashboardPage.userSettingsOption.click();
        await app.userSettings.addFullName(fullName);
        await app.dashboardPage.profileAndSettingsButton.click();
        await app.dashboardPage.userProfileOption.click();
        await expect(app.userProfile.fullName).toHaveText(fullName);
    });
});