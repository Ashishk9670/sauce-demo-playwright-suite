import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CheckoutPage } from '../pages/CheckoutPage';

interface PageFixtures {
  homePage: HomePage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  searchResultsPage: SearchResultsPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  checkoutPage: CheckoutPage;
}

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  searchResultsPage: async ({ page }, use) => use(new SearchResultsPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';
