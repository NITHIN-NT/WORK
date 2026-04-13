import { test, expect } from '@playwright/test';

test('has title and login link', async ({ page }) => {
  await page.goto('/login');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Project Workspace/i);

  // Check for login button or text
  await expect(page.getByText(/Sign in to Workspace/i)).toBeVisible();
});

test('check dashboard redirection or content', async ({ page }) => {
  // Since we are not logged in, it might redirect to login, but let's check if the URL is correct
  await page.goto('/');
  // If there's a redirect, we'll end up at /login
  if (page.url().includes('/login')) {
    await expect(page.getByText(/Sign in/i)).toBeVisible();
  } else {
    // If we happen to be logged in (unlikely in fresh test)
    await expect(page.getByText(/Command Center/i)).toBeVisible();
  }
});
