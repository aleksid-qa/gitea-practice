import { test, expect } from '../utils/fixtures/app';

test('multiple tabs test', async ({ app, context }) => {
    const helpPagePromise = context.waitForEvent('page');

    await app.page.goto('/');
    await app.page.getByText('Help').click();
    const helpPage = await helpPagePromise;
    await expect(helpPage.locator('h1', { hasText: 'What is Gitea' })).toBeVisible();
    await app.page.bringToFront();
    await app.page.waitForTimeout(2000);
    await helpPage.bringToFront();
    await helpPage.waitForTimeout(2000);
});