import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly recoverEmailInput: Locator;
  readonly recoverSubmitButton: Locator;
  readonly cancelRecoverLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#customer_email');
    this.passwordInput = page.locator('#customer_password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByText('Incorrect email or password');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    // Same duplicate-id pattern as the register form: #recover_email is a
    // wrapping <div>, the actual field is #recover-email (hyphen, not underscore).
    this.recoverEmailInput = page.locator('#recover-email');
    this.recoverSubmitButton = page.locator('form[action="/account/recover"] input[type="submit"]');
    this.cancelRecoverLink = page.getByRole('link', { name: 'Cancel' });
  }

  async goto(): Promise<void> {
    await super.goto('/account/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async openForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async cancelForgotPassword(): Promise<void> {
    await this.cancelRecoverLink.click();
  }
}
