import { test, expect } from "@playwright/test";
import RegisterPage from "../pom/pages/Register.page";
import { alreadyRegisteredData, invalidRegisterData, validRegisterData } from "../test-data/register.data";
import BasePage from "../pom/BasePage.page";
import Dashboard from "../pom/pages/Dashboard.page";
import { RegisterMessages } from "../test-data/messages/register-messages.data";



test.describe("Registration flows", () => {
    let registerPage: RegisterPage;
    let basePage: BasePage;
    let dashboard: Dashboard;
    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        basePage = new BasePage(page);
        dashboard = new Dashboard(page);
        await registerPage.goto();
    })

    test("Valid registration", async ({ page }) => {
        await registerPage.register(validRegisterData.username, validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(page).toHaveURL(dashboard.url);
        await expect(dashboard.organizationDropdown).toHaveText(validRegisterData.username);
        await expect(dashboard.accountCreatedSuccessMessage).toBeVisible();
    })

    test("Empty username", async ({ page }) => {
        await registerPage.register('', validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(registerPage.usernameInput).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.usernameInput).toHaveJSProperty('validationMessage', RegisterMessages.EMPTY_FIELD);
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Already registered username", async ({ page }) => {
        await registerPage.register(alreadyRegisteredData.username, validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(registerPage.errorUsernameTaken).toBeVisible();
        await registerPage.expectFieldsInvalidStyle(registerPage.usernameInput);
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Invalid username", async ({ page }) => {
        await registerPage.register(invalidRegisterData.username, validRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(registerPage.errorUsernameInvalid).toBeVisible();
        await registerPage.expectFieldsInvalidStyle(registerPage.usernameInput);
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Empty email", async ({ page }) => {
        await registerPage.register(validRegisterData.username, '', validRegisterData.password, validRegisterData.password);
        await expect(registerPage.emailInput).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.emailInput).toHaveJSProperty('validationMessage', RegisterMessages.EMPTY_FIELD);
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Already registered email", async ({ page }) => {
        //review the case with the username, a workaround is added for now for the test to work correctly in the suit, but the approach
        //is not optimal. The approach with the "getValidRegisterData" helper method in register.data.ts was checked, but it
        //slowed down the whole suite execution due to the data re-creation before each test (even when the data is not used in the test).
        //Clarification with Mykhailo is required to check what would be the best approach in that case.
        await registerPage.register(`${validRegisterData.username}1`, alreadyRegisteredData.email, validRegisterData.password, validRegisterData.password);
        await expect(registerPage.errorEmailTaken).toBeVisible();
        await registerPage.expectFieldsInvalidStyle(registerPage.emailInput);
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Invalid email", async ({ page }) => {
        await registerPage.register(validRegisterData.username, invalidRegisterData.email, validRegisterData.password, validRegisterData.password);
        await expect(registerPage.emailInput).toHaveJSProperty('validity.valid', false);
        await expect(registerPage.emailInput).toHaveJSProperty('validationMessage', RegisterMessages.EMAIL_INVALID(invalidRegisterData.email));
        await expect(page).toHaveURL(registerPage.url);
        await registerPage.enterEmail(invalidRegisterData.emailWithAtSign);
        await expect(registerPage.emailInput).toHaveJSProperty('validity.valid', false);
        await expect(registerPage.emailInput).toHaveJSProperty('validationMessage', RegisterMessages.EMAIL_MISSING_AT_SIGN(invalidRegisterData.emailWithAtSign));
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Empty password", async ({ page }) => {
        await registerPage.register(validRegisterData.username, validRegisterData.email, '', validRegisterData.password);
        await expect(registerPage.passwordInput).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.passwordInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Empty confirm password", async ({ page }) => {
        await registerPage.register(validRegisterData.username, validRegisterData.email, validRegisterData.password, '');
        await expect(registerPage.confirmPasswordInput).toHaveJSProperty('validity.valueMissing', true);
        await expect(registerPage.confirmPasswordInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');
        await expect(page).toHaveURL(registerPage.url);
    })
    test("Non-matching passwords", async ({ page }) => {
        await registerPage.register(validRegisterData.username, validRegisterData.email, validRegisterData.password, invalidRegisterData.nonMatchingPassword);
        await expect(registerPage.errorPasswordsNotMatch).toBeVisible();
        await registerPage.expectFieldsInvalidStyle(registerPage.passwordInput, registerPage.confirmPasswordInput);
        await expect(page).toHaveURL(registerPage.url);
    })

    test("Short passwords", async ({ page }) => {
        await registerPage.register(validRegisterData.username, validRegisterData.email, invalidRegisterData.password, invalidRegisterData.password);
        await expect(registerPage.errorPasswordTooShort).toBeVisible();
        await registerPage.expectFieldsInvalidStyle(registerPage.passwordInput, registerPage.confirmPasswordInput);
        await expect(page).toHaveURL(registerPage.url);
    })
})