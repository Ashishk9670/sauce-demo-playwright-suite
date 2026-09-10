import { test, expect } from '../../src/fixtures/pageFixtures';
import { buildDisposableUser, IN_STOCK_PRODUCTS } from '../../src/fixtures/testData';

const [product] = IN_STOCK_PRODUCTS;

// Tagged @account: registers a real disposable customer on the live store.
// See tests/account/registration.spec.ts for the pollution tradeoff.
test.describe('Full purchase journey @account @journey', () => {
  test('signup, login, add to cart, checkout, and browse site pages', async ({
    registerPage,
    loginPage,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    const user = buildDisposableUser();

    await test.step('sign up as a new customer', async () => {
      await registerPage.goto();
      await registerPage.register(user);
      await expect(homePage.header.logOutLink).toBeVisible();
    });

    await test.step('log out, then log back in', async () => {
      await page.goto('/account/logout');
      await loginPage.goto();
      await loginPage.login(user.email, user.password);
      await expect(homePage.header.logOutLink).toBeVisible();
    });

    await test.step('add a product to the cart', async () => {
      await productPage.gotoProduct(product.slug);
      await productPage.addToCart();
      await homePage.header.expectCartCount(1);
    });

    await test.step('proceed to checkout', async () => {
      await homePage.header.goToCart();
      await expect(cartPage.lineItem(product.name)).toBeVisible();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitUntilLoaded();
      expect(checkoutPage.isOnCheckout()).toBe(true);
    });

    await test.step('browse other pages from the left nav', async () => {
      await homePage.goto();

      await homePage.header.blogNavLink.click();
      await expect(page).toHaveURL(/\/blogs\/news/);
      await expect(page).toHaveTitle(/News/);

      await homePage.header.aboutUsNavLink.click();
      await expect(page).toHaveURL(/\/pages\/about-us/);
      await expect(page.getByRole('heading', { name: 'About Us' }).first()).toBeVisible();

      // "Wish list" and "Refer a friend" point at #sauce-show-* anchors for a
      // third-party widget that isn't wired up on this demo store (no element
      // with those ids exists, confirmed via DOM inspection) — clicking them
      // produces no observable state change, so we only assert they render in
      // the nav rather than asserting behavior that doesn't exist.
      await expect(homePage.wishListLink).toBeVisible();
      await expect(homePage.referFriendLink).toBeVisible();
    });
  });
});
