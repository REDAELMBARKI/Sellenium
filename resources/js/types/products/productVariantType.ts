
export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  stockManaged?: boolean;
  options?: Record<string, any>; // e.g., { color: "Red", size: "M" }
  media?: any;             // optional media per variant
}




