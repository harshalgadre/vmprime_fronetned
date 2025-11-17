export interface Product {
  _id: string;
  name: string;
  category: 'Rado' | 'Rolex' | 'Fossil' | 'Armani' | 'Casio' | 'Tissot' | 
           'G-Shock' | 'Hublot' | 'Patel' | 'Tag' | 'Cartier' | 'Tommy';
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  originalPrice?: number;
  description: string;
  badge?: 'new' | 'sale' | 'premium' | 'limited';
  colors?: Array<{ 
    name: string; 
    color: string;
    images?: string[];
  }>;
  features?: string[];
  image: string;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}