import { test as base, Page } from '@playwright/test'; // base in that case is used as a new name for the "test" function (just renaming for that file, can be renamed to anything, but usually it is named as "base")

type ScreenSizes = {
    pageMobile: Page,
    pageDesktop: Page,
    pageLargeDesktop: Page,
};

export const test = base.extend<ScreenSizes>({
    pageMobile: async ({ page }, use) => {
        await page.setViewportSize({ width: 393, height: 824 }); // everything that goes before "use" is equivalent of "beforeEach" action
        await use(page);
        console.log(`AFTER USE`); // everything that goes after "use" is equivalent of "afterEach" action
    },
    pageDesktop: async ({ page }, use) => {
        await page.setViewportSize({ width: 1280, height: 720 });
        await use(page);
    },
    pageLargeDesktop: async ({ page }, use) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await use(page);
    },
});