export interface Product {
  name: string;
  slug: string;
  price: string;
  soldOut: boolean;
  hasNamedVariant: boolean;
}

export interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
