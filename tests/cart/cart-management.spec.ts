import { test, expect } from '../../src/fixtures/pageFixtures';
import { IN_STOCK_PRODUCTS } from '../../src/fixtures/testData';

const [productA, productB] = IN_STOCK_PRODUCTS;

test.describe('Cart management', () => {
  test('adding a product updates the cart badge and total', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();
    await homePage.header.expectCartCount(1);

    await cartPage.goto();
    await expect(cartPage.lineItem(productA.name)).toBeVisible();
    await expect(cartPage.totalText).toContainText(productA.price);
  });

  test('adding two different products lists both line items', async ({
    productPage,
    cartPage,
  }) => {
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();
    await productPage.gotoProduct(productB.slug);
    await productPage.addToCart();

    await cartPage.goto();
    await expect(cartPage.lineItem(productA.name)).toBeVisible();
    await expect(cartPage.lineItem(productB.name)).toBeVisible();
  });

  test('updating quantity recalculates the line total', async ({ productPage, cartPage }) => {
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.setQuantity(productA.name, 3);
    await cartPage.updateCart();

    const unitPrice = Number(productA.price.replace(/[^0-9.]/g, ''));
    const expectedTotal = `£${(unitPrice * 3).toFixed(2)}`;

    await expect(cartPage.quantityInput(productA.name)).toHaveValue('3');
    await expect(cartPage.lineTotal(productA.name)).toContainText(expectedTotal);
  });

  test('removing an item empties the cart', async ({ productPage, cartPage }) => {
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.removeItem(productA.name);

    await expect(cartPage.lineItem(productA.name)).toHaveCount(0);
    expect(await cartPage.isEmpty()).toBe(true);
  });

  test('an order note can be attached to the cart', async ({ productPage, cartPage }) => {
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.addOrderNote('Please gift wrap this order.');
    await cartPage.updateCart();

    await expect(cartPage.noteTextarea).toHaveValue('Please gift wrap this order.');
  });

  test('adding the same product twice merges into one line item', async ({
    productPage,
    cartPage,
    homePage,
  }) => {
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();
    await productPage.gotoProduct(productA.slug);
    await productPage.addToCart();

    // Confirmed via the store's /cart.js API: a repeat add-to-cart for the
    // same variant increments the existing line's quantity rather than
    // creating a second line item.
    await homePage.header.expectCartCount(2);
    await cartPage.goto();
    await expect(cartPage.lineItem(productA.name)).toHaveCount(1);
    await expect(cartPage.quantityInput(productA.name)).toHaveValue('2');
  });

  test('an empty cart shows a message and a link back to the catalog', async ({ cartPage }) => {
    await cartPage.goto();

    expect(await cartPage.isEmpty()).toBe(true);
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.continueShoppingLink).toHaveAttribute('href', /\/collections\/all/);
  });
});
