import { test, expect } from '@playwright/test';

test.describe('Authentication Engine', () => {
  test('unauthenticated users are redirected to login', async ({ page }) => {
    // Navigate to dashboard directly
    await page.goto('/');

    // Wait for the AuthGuard to realize there is no user and redirect
    await expect(page).toHaveURL(/.*\/login/);

    // Verify login page elements are rendered
    await expect(page.getByRole('heading', { name: "Project Platform" })).toBeVisible();
    await expect(page.getByPlaceholder("Terminal ID / UID")).toBeVisible();
    await expect(page.getByRole('button', { name: "Initialize Session" })).toBeVisible();
  });
});
