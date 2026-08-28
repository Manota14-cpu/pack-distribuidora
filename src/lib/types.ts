export type CategorySlug =
  | "vasos"
  | "platos"
  | "cubiertos"
  | "bandejas-envases"
  | "bolsas"
  | "film-envoltorios"
  | "servilletas"
  | "gastronomia"
  | "eventos"
  | "limpieza";

export interface Category {
  slug: CategorySlug;
  name: string;
  icon: string; // lucide icon name
  description: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  sortOrder?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  longDescription: string;
  features: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  icon: string; // lucide icon name used as visual fallback
  stock: number;
  unit: string;
  featured: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  sku?: string;
  barcode?: string;
  weightGrams?: number;
  dimensions?: string;
  minWholesaleQty?: number;
  wholesalePrice?: number;
  metaTitle?: string;
  metaDescription?: string;
  images?: ProductImage[];
}