import { faker } from '@faker-js/faker';
import { Product, TestUser } from '../types';

// Confirmed via live DOM inspection: display names don't always match the
// product's URL slug (e.g. "Black heels" is served at /products/flower-print-jeans),
// so specs must look products up by name, never derive a slug from the name.
//
// `hasNamedVariant`: also confirmed via DOM inspection. Most products here have
// a single variant labeled "Default Title" (Shopify's literal default), and the
// theme hides the variant dropdown for those as meaningless UX. A few products
// were set up with the option custom-labeled after the product itself instead —
// for those the dropdown renders. This is real per-product data inconsistency
// on the store, not a bug, so tests must branch on it rather than assume one
// behavior for every in-stock product.
export const CATALOG: Product[] = [
  { name: 'Grey jacket', slug: 'grey-jacket', price: '£55.00', soldOut: false, hasNamedVariant: true },
  { name: 'Noir jacket', slug: 'noir-jacket', price: '£60.00', soldOut: false, hasNamedVariant: true },
  { name: 'Striped top', slug: 'striped-top', price: '£50.00', soldOut: false, hasNamedVariant: false },
  { name: 'Black heels', slug: 'flower-print-jeans', price: '£45.00', soldOut: false, hasNamedVariant: true },
  { name: 'Bronze sandals', slug: 'bronze-sandals', price: '£39.99', soldOut: false, hasNamedVariant: false },
  { name: 'Brown Shades', slug: 'brown-shades', price: '£20.00', soldOut: true, hasNamedVariant: false },
  { name: 'White sandals', slug: 'white-sandals', price: '£25.00', soldOut: true, hasNamedVariant: false },
];

export const IN_STOCK_PRODUCTS = CATALOG.filter((p) => !p.soldOut);
export const SOLD_OUT_PRODUCTS = CATALOG.filter((p) => p.soldOut);

/**
 * Sauce Demo is a real Shopify store, so registration creates a real customer
 * record. Timestamp + random suffix keeps every CI run's account unique.
 */
export function buildDisposableUser(): TestUser {
  const unique = `${Date.now()}-${faker.string.alphanumeric(6)}`;
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `sdet+${unique}@example.com`,
    password: faker.internet.password({ length: 14 }),
  };
}
