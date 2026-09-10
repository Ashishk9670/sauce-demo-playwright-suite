import { test, expect } from '../../src/fixtures/pageFixtures';
import { buildDisposableUser } from '../../src/fixtures/testData';

// Tagged @account: registers a disposable customer, then exercises real
// login/logout against it. See registration.spec.ts for the pollution tradeoff.
test.describe('Login @account', () => {
  test('a registered customer can log in and out', async ({
    registerPage,
    loginPage,
    homePage,
  }) => {
    const user = buildDisposableUser();
    await registerPage.goto();
    await registerPage.register(user);
    await homePage.page.goto('/account/logout');

    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await expect(homePage.header.logOutLink).toBeVisible();
  });

  test('an invalid password shows Shopify\'s error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nonexistent-user-e2e-test@example.com', 'wrongpassword123');

    await expect(loginPage.errorMessage).toBeVisible();
  });
});
