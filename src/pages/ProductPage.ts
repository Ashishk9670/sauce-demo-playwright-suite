import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productForm: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly variantSelect: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productForm = page.locator('#product-form');
    this.productTitle = this.productForm.locator('h1[itemprop="name"]');
    this.productPrice = this.productForm.locator('.product-price');
    this.variantSelect = this.productForm.locator('#product-select-option-0');
    this.addToCartButton = this.productForm.locator('#add');
  }

  async gotoProduct(slug: string): Promise<void> {
    await super.goto(`/collections/all/products/${slug}`);
  }

  async addToCart(): Promise<void> {
    // The button click only dispatches a DOM event; the theme's JS then fires
    // an async POST /cart/add.js. Without waiting for that response, a
    // subsequent cart navigation can race ahead of the cart actually updating.
    await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes('/cart/add') && res.request().method() === 'POST',
      ),
      this.addToCartButton.click(),
    ]);
  }

  async isSoldOut(): Promise<boolean> {
    return this.addToCartButton.isDisabled();
  }
}
