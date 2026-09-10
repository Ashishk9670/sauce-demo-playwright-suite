import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home, Catalog, and Search results all render the same thing underneath:
 * a list of `<a href=".../products/...">` cards. Shared here so the three
 * concrete pages don't each re-implement "find/click/check a product by name".
 */
export abstract class ProductListingPage extends BasePage {
  readonly productLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.productLinks = page.locator('a[href*="/products/"]');
  }

  productLink(productName: string): Locator {
    return this.productLinks.filter({ hasText: productName }).first();
  }

  async productCount(): Promise<number> {
    return this.productLinks.count();
  }

  async isSoldOut(productName: string): Promise<boolean> {
    return /sold out/i.test(await this.productLink(productName).innerText());
  }

  async openProduct(productName: string): Promise<void> {
    await this.productLink(productName).click();
  }
}
