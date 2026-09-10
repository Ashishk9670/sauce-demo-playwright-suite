import { test, expect } from '../../src/fixtures/pageFixtures';
import { buildDisposableUser } from '../../src/fixtures/testData';

// Tagged @account: these specs create/authenticate real customer records on the
// live Shopify store, so CI can isolate them from pure-read flows if they flake.
test.describe('Registration @account', () => {
  test('a new customer can register with disposable data', async ({ registerPage, homePage }) => {
    const user = buildDisposableUser();

    await registerPage.goto();
    await registerPage.register(user);

    // Shopify redirects a fresh registration to "/" and swaps the header's
    // "Log In" link for "Log Out" — that's the reliable signed-in signal here,
    // since the destination page itself carries no per-user confirmation text.
    await expect(homePage.header.logOutLink).toBeVisible();

    await homePage.page.goto('/account');
    await expect(homePage.page.getByText(user.firstName)).toBeVisible();
  });
});
