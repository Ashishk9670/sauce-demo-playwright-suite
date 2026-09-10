import { test, expect } from '../../src/fixtures/pageFixtures';

test.describe('Search', () => {
  test('searching via the header box returns results', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.header.searchFor('jacket');

    await expect(page).toHaveURL(/\/search\?.*q=jacket/);
    await expect(page).toHaveTitle(/results found/i);
  });

  test('searching for a nonsense query returns no results', async ({ searchResultsPage }) => {
    await searchResultsPage.goto('zzzznonexistentproductzzzz');
    await expect(searchResultsPage.page).toHaveTitle(/0 results found/i);
    expect(await searchResultsPage.resultCount()).toBe(0);
  });
});
