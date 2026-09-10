import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestUser } from '../types';

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    super(page);
    // The theme reuses the field ids on a wrapping <div>, so a bare `#id`
    // selector is ambiguous (strict-mode violation) — target the input directly.
    this.firstNameInput = page.locator('input[name="customer[first_name]"]');
    this.lastNameInput = page.locator('input[name="customer[last_name]"]');
    this.emailInput = page.locator('input[name="customer[email]"]');
    this.passwordInput = page.locator('input[name="customer[password]"]');
    this.createButton = page.locator('input[type="submit"][value="Create"]');
  }

  async goto(): Promise<void> {
    await super.goto('/account/register');
  }

  async register(user: TestUser): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.createButton.click();
  }
}
