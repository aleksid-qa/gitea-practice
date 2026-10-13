import { test, expect } from "../utils/fixtures/app";
import { alreadyRegisteredData, invalidRegisterData, validRegisterData } from "../test-data/register.data";
import { RegisterMessages } from "../test-data/messages/register-messages.data";

test.describe("Registration flows", () => {
    test.beforeEach(async ({ app }) => {
        await app.registerPage.goto();
    })

    test("Valid registration", async ({ app }) => {

        await test.step("Register with valid data", async () => {
            await app.registerPage.register(validRegisterData.username, validRegisterData.email, validRegisterData.password, validRegisterData.password);
        });
        await test.step("Verify redirection to dashboard", async () => {
            await expect(app.page).toHaveURL(app.dashboardPage.url);
            await expect(app.dashboardPage.organizationDropdown).toHaveText(validRegisterData.username);
            await expect(app.dashboardPage.accountCreatedSuccessMessage).toBeVisible();
        });
    })

    test("Empty username", async ({ app }) => {
        await app.registerPage.register('', validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await app.registerPage.validateEmptyMessage(app.registerPage.usernameInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Already registered username", async ({ app }) => {
        await app.registerPage.register(alreadyRegisteredData.username, validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(app.registerPage.errorUsernameTaken).toBeVisible();
        await app.registerPage.expectFieldsInvalidStyle(app.registerPage.usernameInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Invalid username", async ({ app }) => {
        await app.registerPage.register(invalidRegisterData.username, validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(app.registerPage.errorUsernameInvalid).toBeVisible();
        await app.registerPage.expectFieldsInvalidStyle(app.registerPage.usernameInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Empty email", async ({ app }) => {
        await app.registerPage.register(validRegisterData.username, '', validRegisterData.password, validRegisterData.password);
        await app.registerPage.validateEmptyMessage(app.registerPage.emailInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Already registered email", async ({ app }) => {
        //review the case with the username, a workaround is added for now for the test to work correctly in the suit, but the approach
        //is not optimal. The approach with the "getValidRegisterData" helper method in register.data.ts was checked, but it
        //slowed down the whole suite execution due to the data re-creation before each test (even when the data is not used in the test).
        //Clarification with Mykhailo is required to check what would be the best approach in that case.
        await app.registerPage.register(`${validRegisterData.username}1`, alreadyRegisteredData.email, validRegisterData.password, validRegisterData.password);
        await expect(app.registerPage.errorEmailTaken).toBeVisible();
        await app.registerPage.expectFieldsInvalidStyle(app.registerPage.emailInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Invalid email", async ({ app }) => {
        await app.registerPage.register(validRegisterData.username, invalidRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(app.registerPage.emailInput).toHaveJSProperty('validity.valid', false);
        await expect(app.registerPage.emailInput).toHaveJSProperty('validationMessage', RegisterMessages.EMAIL_INVALID(invalidRegisterData.email));
        await expect(app.page).toHaveURL(app.registerPage.url);
        await app.registerPage.enterEmail(invalidRegisterData.emailWithAtSign);
        await expect(app.registerPage.emailInput).toHaveJSProperty('validity.valid', false);
        await expect(app.registerPage.emailInput).toHaveJSProperty('validationMessage', RegisterMessages.EMAIL_MISSING_AT_SIGN(invalidRegisterData.emailWithAtSign));
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Empty password", async ({ app }) => {
        await app.registerPage.register(validRegisterData.username, validRegisterData.email, '', validRegisterData.password);
        await app.registerPage.validateEmptyMessage(app.registerPage.passwordInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Empty confirm password", async ({ app }) => {
        await app.registerPage.register(validRegisterData.username, validRegisterData.email, validRegisterData.password, '');
        await app.registerPage.validateEmptyMessage(app.registerPage.confirmPasswordInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Non-matching passwords", async ({ app }) => {
        await app.registerPage.register(validRegisterData.username, validRegisterData.email, validRegisterData.password, invalidRegisterData.nonMatchingPassword);
        await expect(app.registerPage.errorPasswordsNotMatch).toBeVisible();
        await app.registerPage.expectFieldsInvalidStyle(app.registerPage.passwordInput, app.registerPage.confirmPasswordInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })

    test("Short passwords", async ({ app }) => {
        await app.registerPage.register(validRegisterData.username, validRegisterData.email, invalidRegisterData.password, invalidRegisterData.password);
        await expect(app.registerPage.errorPasswordTooShort).toBeVisible();
        await app.registerPage.expectFieldsInvalidStyle(app.registerPage.passwordInput, app.registerPage.confirmPasswordInput);
        await expect(app.page).toHaveURL(app.registerPage.url);
    })
})