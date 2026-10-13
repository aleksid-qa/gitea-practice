//one of variations of using fixtures, can be used instead of the app fixture if you like it more

import { test as base } from '@playwright/test'; // base in that case is used as a new name for the "test" function (just renaming for that file, can be renamed to anything, but usually it is named as "base")
import RegisterPage from '../../pom/pages/Register.page';
import DashboardPage from '../../pom/pages/Dashboard.page';

type PageObjects = {
    registerPage: RegisterPage,
    dashboardPage: DashboardPage
};

export const test = base.extend<PageObjects>({
    registerPage: async ({ page }, use) => {
        let registerPage = new RegisterPage(page);
        await registerPage.goto();
        await use(registerPage);
    },
    dashboardPage: async ({ page }, use) => {
        let dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
});

export { expect } from '@playwright/test';