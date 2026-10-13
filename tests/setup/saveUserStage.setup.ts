import { faker } from "@faker-js/faker";
import { test, expect } from "../../utils/fixtures/app";
import saveUserData from "../../utils/dataGeneration/saveUserData";

test('Register new user and save its storage state', async ({ app }) => {
    const testUsername = faker.internet.username();
    const testUserEmail = faker.internet.email();
    const testUserPassword = faker.internet.password({ length: 8 });

    await app.registerPage.goto();
    await app.registerPage.register(testUsername, testUserEmail, testUserPassword, testUserPassword);
    await expect(app.dashboardPage.organizationDropdown).toHaveText(testUsername);
    await app.page.context().storageState({ path: '.states/testuser1.json' });

    saveUserData({ username: testUsername, email: testUserEmail, password: testUserPassword }, './test-data/users/testuser1.json');
})