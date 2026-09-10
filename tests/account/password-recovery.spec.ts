import { test, expect } from '../../src/fixtures/pageFixtures';

// Unlike login/registration, this only exercises the client-side show/hide
// toggle. Submitting the recover form is gated by the same hCaptcha widget
// that blocks login/registration under Playwright (see README) — confirmed
// via network inspection that the POST never fires — so this suite
// deliberately stops short of submitting it.
test.describe('Password recovery', () => {
  test('forgot password reveals the recovery form, cancel hides it again', async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await expect(loginPage.recoverEmailInput).toBeHidden();

    await loginPage.openForgotPassword();
    await expect(loginPage.recoverEmailInput).toBeVisible();
    await expect(loginPage.recoverSubmitButton).toBeVisible();

    await loginPage.cancelForgotPassword();
    await expect(loginPage.recoverEmailInput).toBeHidden();
    await expect(loginPage.emailInput).toBeVisible();
  });
});
