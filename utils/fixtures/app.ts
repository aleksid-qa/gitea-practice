//equivalent of the "pages" fixture, but for the entire app. Not as useful if you have a lot of page objects on the project

import { test as base, Page } from '@playwright/test';
import RegisterPage from '../../pom/pages/Register.page';
import DashboardPage from '../../pom/pages/Dashboard.page';
import CreateNewRepositoryPage from '../../pom/pages/CreateNewRepository.page';
import RepositoryPage from '../../pom/pages/Repository.page';
import LoginPage from '../../pom/pages/Login.page';
import UserSettings from '../../pom/pages/userSettings.page';
import UserProfile from '../../pom/pages/userProfile.page';

type App = {
    page: Page,
    registerPage: RegisterPage,
    loginPage: LoginPage,
    dashboardPage: DashboardPage,
    createNewRepository: CreateNewRepositoryPage,
    repository: RepositoryPage,
    userSettings: UserSettings,
    userProfile: UserProfile,
};

export const test = base.extend<{ app: App }>({
    app: async ({ page }, use) => {
        const app: App = {
            page,
            registerPage: new RegisterPage(page),
            loginPage: new LoginPage(page),
            dashboardPage: new DashboardPage(page),
            createNewRepository: new CreateNewRepositoryPage(page),
            repository: new RepositoryPage(page),
            userSettings: new UserSettings(page),
            userProfile: new UserProfile(page),
        };
        await use(app);
    },
});

export { expect } from '@playwright/test';