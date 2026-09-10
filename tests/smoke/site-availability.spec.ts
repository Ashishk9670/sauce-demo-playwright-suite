import { test, expect } from '../../src/fixtures/pageFixtures';

test.describe('Smoke @smoke', () => {
  test('home page loads with featured products and nav', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.page).toHaveTitle(/Sauce Demo/);
    await expect(homePage.header.homeNavLink).toBeVisible();
    await expect(homePage.header.catalogNavLink).toBeVisible();
    await expect(homePage.featuredProductLinks).toHaveCount(3);
  });

  test('primary nav links resolve to their pages', async ({ homePage, page }) => {
    await homePage.goto();

    await homePage.header.catalogNavLink.click();
    await expect(page).toHaveURL(/\/collections\/all/);

    await homePage.header.aboutUsNavLink.click();
    await expect(page).toHaveURL(/\/pages\/about-us/);
  });

  test('Blog link renders the store blog', async ({ homePage, page }) => {
    await homePage.goto();

    await homePage.header.blogNavLink.click();
    await expect(page).toHaveURL(/\/blogs\/news/);
    await expect(page).toHaveTitle(/News/);
  });

  test('header auth links open the login and signup pages', async ({ homePage, page }) => {
    await homePage.goto();

    await homePage.header.loginLink.click();
    await expect(page).toHaveURL(/\/account\/login/);

    await page.goBack();
    await homePage.header.signUpLink.click();
    await expect(page).toHaveURL(/\/account\/register/);
  });

  test('header search icon opens the search page', async ({ homePage, page }) => {
    await homePage.goto();

    await homePage.header.searchLink.click();
    await expect(page).toHaveURL(/\/search/);
  });
});
