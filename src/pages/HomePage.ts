import { Page, Locator } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';

export class HomePage extends ProductListingPage {
  readonly wishListLink: Locator;
  readonly referFriendLink: Locator;

  constructor(page: Page) {
    super(page);
    this.wishListLink = page.getByRole('link', { name: 'Wish list' });
    this.referFriendLink = page.getByRole('link', { name: 'Refer a friend' });
  }

  async goto(): Promise<void> {
    await super.goto('/');
  }

  get featuredProductLinks(): Locator {
    return this.productLinks;
  }
}
