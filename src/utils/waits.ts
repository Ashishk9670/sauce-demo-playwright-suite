import { Locator, expect } from '@playwright/test';

/**
 * Shopify updates the cart badge via an async AJAX call after add/update/remove.
 * Wraps the poll in a semantic helper instead of scattering waitForTimeout calls.
 */
export async function waitForCartCount(cartCountLocator: Locator, expectedCount: number): Promise<void> {
  await expect(cartCountLocator).toHaveText(new RegExp(`\\(${expectedCount}\\)`));
}
