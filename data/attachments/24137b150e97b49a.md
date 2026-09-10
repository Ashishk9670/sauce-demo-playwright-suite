# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout/checkout-flow.spec.ts >> Checkout handoff >> proceeding to checkout reaches Shopify checkout with the cart contents
- Location: tests/checkout/checkout-flow.spec.ts:9:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#cart').locator('input[type="submit"][value="Check Out"]')

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - heading "Your connection needs to be verified before you can proceed" [level=1] [ref=f2e5]
  - main [ref=f2e7]:
    - generic [ref=f2e8]:
      - heading [level=2]
      - paragraph
```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | 
  4  | export class CartPage extends BasePage {
  5  |   // Scoped to #cart: the site also injects a hidden mini-cart drawer (#drawer)
  6  |   // with an identical form on every page, so unscoped locators would be ambiguous.
  7  |   readonly container: Locator;
  8  |   readonly lineItems: Locator;
  9  |   readonly noteTextarea: Locator;
  10 |   readonly updateButton: Locator;
  11 |   readonly checkOutButton: Locator;
  12 |   readonly totalText: Locator;
  13 |   readonly emptyCartMessage: Locator;
  14 |   readonly continueShoppingLink: Locator;
  15 | 
  16 |   constructor(page: Page) {
  17 |     super(page);
  18 |     this.container = page.locator('#cart');
  19 |     this.lineItems = this.container.locator('form[action="/cart"] .row');
  20 |     this.noteTextarea = this.container.locator('textarea#note');
  21 |     this.updateButton = this.container.locator('input[type="submit"][value="Update"]');
  22 |     this.checkOutButton = this.container.locator('input[type="submit"][value="Check Out"]');
  23 |     // Both a bare "Total" header cell and a "Total £x" summary heading exist
  24 |     // in #cart, so a plain text match is ambiguous — anchor to the heading.
  25 |     this.totalText = this.container.getByRole('heading', { name: /Total/ });
  26 |     this.emptyCartMessage = this.container.getByText('your cart is currently empty');
  27 |     this.continueShoppingLink = this.container.getByRole('link', { name: 'Continue Shopping' });
  28 |   }
  29 | 
  30 |   async goto(): Promise<void> {
  31 |     await super.goto('/cart');
  32 |   }
  33 | 
  34 |   lineItem(productName: string): Locator {
  35 |     return this.lineItems.filter({ hasText: productName });
  36 |   }
  37 | 
  38 |   quantityInput(productName: string): Locator {
  39 |     return this.lineItem(productName).locator('input[name="updates[]"]');
  40 |   }
  41 | 
  42 |   lineTotal(productName: string): Locator {
  43 |     return this.lineItem(productName).locator('.total');
  44 |   }
  45 | 
  46 |   removeLink(productName: string): Locator {
  47 |     // The theme has served this link both as `a.removeLine` and, on this
  48 |     // store, as a bare `<a href="/cart/change?...quantity=0">` with no class
  49 |     // — match on the href's semantics instead of a class that isn't reliably present.
  50 |     return this.lineItem(productName).locator('a[href*="quantity=0"]');
  51 |   }
  52 | 
  53 |   async setQuantity(productName: string, quantity: number): Promise<void> {
  54 |     await this.quantityInput(productName).fill(String(quantity));
  55 |   }
  56 | 
  57 |   async updateCart(): Promise<void> {
  58 |     await this.updateButton.click();
  59 |   }
  60 | 
  61 |   async removeItem(productName: string): Promise<void> {
  62 |     await this.removeLink(productName).click();
  63 |   }
  64 | 
  65 |   async proceedToCheckout(): Promise<void> {
> 66 |     await this.checkOutButton.click();
     |                               ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  67 |   }
  68 | 
  69 |   async addOrderNote(note: string): Promise<void> {
  70 |     await this.noteTextarea.fill(note);
  71 |   }
  72 | 
  73 |   async isEmpty(): Promise<boolean> {
  74 |     return (await this.lineItems.count()) === 0;
  75 |   }
  76 | }
  77 | 
```