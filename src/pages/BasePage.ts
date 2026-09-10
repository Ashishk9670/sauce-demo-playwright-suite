import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export abstract class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }
}
