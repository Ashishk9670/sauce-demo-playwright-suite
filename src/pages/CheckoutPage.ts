import { BasePage } from './BasePage';

/**
 * Real Shopify checkout (`/checkouts/cn/...`, same domain). The framework only
 * verifies the cart hands off correctly — it never submits payment or PII here.
 */
export class CheckoutPage extends BasePage {
  async waitUntilLoaded(): Promise<void> {
    await this.page.waitForURL(/\/checkouts\/cn\//);
  }

  isOnCheckout(): boolean {
    return /\/checkouts\/cn\//.test(this.page.url());
  }
}
