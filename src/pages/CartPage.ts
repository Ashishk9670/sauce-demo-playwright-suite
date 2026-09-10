import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Scoped to #cart: the site also injects a hidden mini-cart drawer (#drawer)
  // with an identical form on every page, so unscoped locators would be ambiguous.
  readonly container: Locator;
  readonly lineItems: Locator;
  readonly noteTextarea: Locator;
  readonly updateButton: Locator;
  readonly checkOutButton: Locator;
  readonly totalText: Locator;
  readonly emptyCartMessage: Locator;
  readonly continueShoppingLink: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.locator('#cart');
    this.lineItems = this.container.locator('form[action="/cart"] .row');
    this.noteTextarea = this.container.locator('textarea#note');
    this.updateButton = this.container.locator('input[type="submit"][value="Update"]');
    this.checkOutButton = this.container.locator('input[type="submit"][value="Check Out"]');
    // Both a bare "Total" header cell and a "Total £x" summary heading exist
    // in #cart, so a plain text match is ambiguous — anchor to the heading.
    this.totalText = this.container.getByRole('heading', { name: /Total/ });
    this.emptyCartMessage = this.container.getByText('your cart is currently empty');
    this.continueShoppingLink = this.container.getByRole('link', { name: 'Continue Shopping' });
  }

  async goto(): Promise<void> {
    await super.goto('/cart');
  }

  lineItem(productName: string): Locator {
    return this.lineItems.filter({ hasText: productName });
  }

  quantityInput(productName: string): Locator {
    return this.lineItem(productName).locator('input[name="updates[]"]');
  }

  lineTotal(productName: string): Locator {
    return this.lineItem(productName).locator('.total');
  }

  removeLink(productName: string): Locator {
    // The theme has served this link both as `a.removeLine` and, on this
    // store, as a bare `<a href="/cart/change?...quantity=0">` with no class
    // — match on the href's semantics instead of a class that isn't reliably present.
    return this.lineItem(productName).locator('a[href*="quantity=0"]');
  }

  async setQuantity(productName: string, quantity: number): Promise<void> {
    await this.quantityInput(productName).fill(String(quantity));
  }

  async updateCart(): Promise<void> {
    await this.updateButton.click();
  }

  async removeItem(productName: string): Promise<void> {
    await this.removeLink(productName).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkOutButton.click();
  }

  async addOrderNote(note: string): Promise<void> {
    await this.noteTextarea.fill(note);
  }

  async isEmpty(): Promise<boolean> {
    return (await this.lineItems.count()) === 0;
  }
}
