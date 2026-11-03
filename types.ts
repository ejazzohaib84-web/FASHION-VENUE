export interface ProductItem {
  id: number;
  name: string;
  defaultName: string;
  price: number;
  defaultPrice: number;
  image: string;
  category: string;
  sizes: string[];
  selectedSize?: string;
  aiRating: string; // e.g. "4.8/5"
  tag?: string;
}

export interface CreatedPost {
  id: string;
  title?: string;
  image: string;
  price: number;
  sizes: string[];
  createdAt: string;
  aiRating?: string;
  productId?: number;
}
