// schemas/productSchema.ts

import { z } from "zod";

// ── Variant Schema ─────────────────────────────────────────────────────────
const colorSchema = z.object({
  hex: z.string().min(1, "Color hex is required"),
  name: z.string().min(1, "Color name is required"),
});

export const variantSchema = z.object({
  variant_id: z.string().optional(),
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .min(0, "Price must be positive"),
  compare_price: z
    .number({ invalid_type_error: "Compare price must be a number" })
    .min(0, "Compare price must be positive")
    .nullable()
    .optional(),
  stock: z
    .number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be 0 or more"),
  sku: z.string().min(1, "SKU is required"),
  image: z.object({
    url: z.string().optional(),
    id: z.number().nullable().optional(),
  }).optional(),
  isOpen: z.boolean({ required_error: "isOpen is required" }),
  attrs: z
    .record(z.string(), z.union([z.string(), colorSchema]))
    .nullable()
    .optional(),
});

// ── Sub-schemas ────────────────────────────────────────────────────────────
const categorySchema = z.object({
  id: z.number({ required_error: "Category ID is required" }),
  name: z.string().min(1, "Category name is required"),
});

// thumbnail validation untouched
const coverSchema = z
  .any()
  .refine((val) => val !== null && val !== undefined, {
    message: "Thumbnail is required",
  })
  .refine((val) => typeof val?.url === "string" && val.url.length > 0, {
    message: "Thumbnail is required",
  });

const videoSchema = z.object({
  id: z.number().optional(),
  url: z.string().min(1, "Video URL is required").url("Video URL must be a valid URL"),
});

// ── All optional now ───────────────────────────────────────────────────────
const inventorySchema = z.object({
  backorderOptions: z.enum(['deny', 'notify', 'allow']).optional(),
  trackInventory: z.boolean().optional(),
  lowStockThreshold: z.number({ invalid_type_error: "Low stock threshold must be a number" }).min(0).nullable().optional(),
  stockStatus: z.enum(['', 'in_stock', 'out_of_stock', 'discontinued']).optional(),
  weight: z.number({ invalid_type_error: "Weight must be a number" }).min(0).nullable().optional(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz']).optional(),
  dimensions: z.object({
    length: z.number({ invalid_type_error: "Length must be a number" }).min(0).nullable().optional(),
    width:  z.number({ invalid_type_error: "Width must be a number"  }).min(0).nullable().optional(),
    height: z.number({ invalid_type_error: "Height must be a number" }).min(0).nullable().optional(),
    unit:   z.enum(['cm', 'in', 'mm']).optional(),
  }).optional(),
  warehouseLocation: z.string().optional(),
  fulfillmentType: z.enum(['', 'dropship', 'third_party']).optional(),
}).optional();

const shippingSchema = z.object({
  shippingClass: z.enum(['', 'express', 'pickup']).optional(),
  shippingCostOverride: z.number({ invalid_type_error: "Shipping cost must be a number" }).min(0).nullable().optional(),
  isReturnable: z.boolean().optional(),
  returnWindow: z.number({ invalid_type_error: "Return window must be a number" }).min(0).optional(),
  returnPolicy: z.enum(['free_return', 'customer_pays']).optional(),
}).optional();

const metaSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
}).optional();

const vendorSchema = z.object({
  vendorName: z.string().optional(),
  vendorSku: z.string().optional(),
  vendorNotes: z.string().optional(),
}).optional();

// ── Main Product Schema ────────────────────────────────────────────────────
export const productSchema = z.object({
  id: z.string().nullable().optional(),
  category_niche_id: z.number({ required_error: "Category niche is required" }),
  name: z.string().min(1, "Product name is required"),

  // optional
  brand: z.string().optional(),
  releaseDate: z.string().optional(),
  madeCountry: z.string().optional(),

  // single product specific
  stock: z
    .number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be 0 or more"),
  sku: z.string().min(1, "SKU is required"),
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .min(0, "Price must be positive"),
  compare_price: z
    .number({ invalid_type_error: "Compare price must be a number" })
    .min(0, "Compare price must be positive")
    .nullable()
    .optional(),

  sub_categories: z.array(categorySchema).min(1, "At least one sub-category is required"),
  description: z.string().min(1, "Description is required"),
  rating_average: z.number({ invalid_type_error: "Rating must be a number" }).min(0).max(5).optional(),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  isFeatured: z.boolean({ required_error: "isFeatured is required" }),
  isFreeShipping: z.boolean({ required_error: "isFreeShipping is required" }),

  thumbnail: coverSchema,
  video: z.array(videoSchema).default([]),
  covers: z.array(coverSchema).nullable(),

  inventory: inventorySchema,
  shipping: shippingSchema,
  meta: metaSchema,
  vendor: vendorSchema,

  faqs: z.array(z.object({
    question: z.string().min(1, "FAQ question is required"),
    answer: z.string().min(1, "FAQ answer is required"),
  })).default([]),

  variants: z.array(variantSchema).default([]),
  product_attributes: z.array(z.any()).default([]),
  related_products: z.array(z.number()).default([]),

  // settings
  badge_text: z.string().nullable(),
  allow_backorder: z.boolean({ required_error: "allow_backorder is required" }),
  show_countdown: z.boolean({ required_error: "show_countdown is required" }),
  show_reviews: z.boolean({ required_error: "show_reviews is required" }),
  show_related_products: z.boolean({ required_error: "show_related_products is required" }),
  show_social_share: z.boolean({ required_error: "show_social_share is required" }),

  // marketing
  promotion_ids: z.array(z.number()).default([]),
  coupon_ids: z.array(z.number()).default([]),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
export type VariantSchemaType = z.infer<typeof variantSchema>;