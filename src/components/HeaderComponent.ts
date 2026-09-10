import { Page, Locator } from '@playwright/test';
import { waitForCartCount } from '../utils/waits';

/**
 * The site header/nav is rendered on every page, so it's modeled once here
 * and composed into BasePage rather than duplicated per page object.
 */
export class HeaderComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchLink: Locator;
  readonly loginLink: Locator;
  readonly signUpLink: Locator;
  readonly logOutLink: Locator;
  readonly cartLink: Locator;
  readonly checkOutLink: Locator;
  readonly homeNavLink: Locator;
  readonly catalogNavLink: Locator;
  readonly blogNavLink: Locator;
  readonly aboutUsNavLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search');
    // "Search" also appears in the footer nav, so an unscoped match is
    // ambiguous — confirmed via DOM inspection there are 3 "Search" links on
    // the page; the real header one lives inside <header>.
    this.searchLink = page.locator('header').getByRole('link', { name: 'Search', exact: true });
    this.loginLink = page.getByRole('link', { name: 'Log In' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    // Replaces loginLink in the header once a customer session exists.
    this.logOutLink = page.getByRole('link', { name: /Log ?Out/i }).first();
    this.cartLink = page.getByRole('link', { name: /My Cart/ });
    this.checkOutLink = page.getByRole('link', { name: 'Check Out' });
    this.homeNavLink = page.getByRole('link', { name: 'Home', exact: true });
    this.catalogNavLink = page.getByRole('link', { name: 'Catalog', exact: true });
    this.blogNavLink = page.getByRole('link', { name: 'Blog', exact: true });
    this.aboutUsNavLink = page.getByRole('link', { name: 'About Us', exact: true }).first();
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async goToCart(): Promise<void> {
    await this.checkOutLink.click();
  }

  async expectCartCount(count: number): Promise<void> {
    await waitForCartCount(this.cartLink, count);
  }
}
