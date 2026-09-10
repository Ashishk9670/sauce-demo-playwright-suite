import { test, expect } from '../../src/fixtures/pageFixtures';
import { CATALOG, IN_STOCK_PRODUCTS, SOLD_OUT_PRODUCTS } from '../../src/fixtures/testData';

test.describe('Catalog browsing', () => {
  test('catalog lists every product in the store', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCards).toHaveCount(CATALOG.length);
  });

  for (const product of SOLD_OUT_PRODUCTS) {
    test(`"${product.name}" is marked sold out in the catalog`, async ({ catalogPage }) => {
      await catalogPage.goto();
      expect(await catalogPage.isSoldOut(product.name)).toBe(true);
    });
  }

  for (const product of IN_STOCK_PRODUCTS) {
    test(`"${product.name}" product page shows correct name and price`, async ({
      catalogPage,
      productPage,
    }) => {
      await catalogPage.goto();
      await catalogPage.openProduct(product.name);

      await expect(productPage.productTitle).toContainText(product.name);
      await expect(productPage.productPrice).toHaveText(product.price);
      // The theme hides the variant dropdown when the product's single
      // variant is Shopify's literal "Default Title" — real per-product data
      // inconsistency on this store, confirmed via DOM inspection, not a bug.
      await expect(productPage.variantSelect).toBeVisible({ visible: product.hasNamedVariant });
      await expect(productPage.addToCartButton).toBeEnabled();
    });
  }

  for (const product of SOLD_OUT_PRODUCTS) {
    test(`"${product.name}" product page disables Add to Cart`, async ({ productPage }) => {
      await productPage.gotoProduct(product.slug);
      expect(await productPage.isSoldOut()).toBe(true);
      await expect(productPage.addToCartButton).toHaveValue('Sold Out');
    });
  }
});
