import { Locator } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';

export class CatalogPage extends ProductListingPage {
  async goto(): Promise<void> {
    await super.goto('/collections/all');
  }

  get productCards(): Locator {
    return this.productLinks;
  }

  productCard(productName: string): Locator {
    return this.productLink(productName);
  }
}
