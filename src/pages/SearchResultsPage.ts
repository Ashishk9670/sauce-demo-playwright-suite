import { ProductListingPage } from './ProductListingPage';

export class SearchResultsPage extends ProductListingPage {
  async goto(query: string): Promise<void> {
    await super.goto(`/search?q=${encodeURIComponent(query)}`);
  }

  async resultCount(): Promise<number> {
    return this.productCount();
  }
}
