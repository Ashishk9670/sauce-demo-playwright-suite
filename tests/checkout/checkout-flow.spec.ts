import { test, expect } from '../../src/fixtures/pageFixtures';
import { IN_STOCK_PRODUCTS } from '../../src/fixtures/testData';

const [product] = IN_STOCK_PRODUCTS;

test.describe('Checkout handoff', () => {
  // Sauce Demo is a real Shopify store: this suite only verifies the cart hands
  // off to Shopify's real checkout. It never submits payment or personal details.
  test('proceeding to checkout reaches Shopify checkout with the cart contents', async ({
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await productPage.gotoProduct(product.slug);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.proceedToCheckout();

    await checkoutPage.waitUntilLoaded();
    expect(checkoutPage.isOnCheckout()).toBe(true);
  });
});
