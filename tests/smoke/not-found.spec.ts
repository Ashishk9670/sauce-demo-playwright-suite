import { test, expect } from '../../src/fixtures/pageFixtures';

test.describe('Not found handling', () => {
  test('a nonexistent product URL renders the store 404 page', async ({ page }) => {
    const response = await page.goto('/collections/all/products/totally-fake-product-xyz');

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/404/);
    await expect(page.getByText('404')).toBeVisible();
  });
});
