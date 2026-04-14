import { test, expect } from '@playwright/test';

// In a real E2E environment we'd use global setup/teardown to authenticate a real mock user 
// so we don't have to login manually every time. For this sprint slice, we assume 
// the dev server is running and we test the component mounting states if possible.

test('has title and login link', async ({ page }) => {
  await page.goto('/login');
  
  // Test basic accessibility and routing structure
  await expect(page).toHaveTitle(/Create Next App/); // Defaults out of box
  await expect(page.getByPlaceholder("Terminal ID / UID")).toBeVisible();
});
