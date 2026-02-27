// schemas/productSchema.ts

import { z } from "zod";

// ── Variant Schema ─────────────────────────────────────────────────────────
const colorSchema = z.object({
  hex: z.string(),
  name: z.string(),
});

export const variantSchema = z.object({
  id: z.string().optional(),
  price: z
    .number({ required_error: "Price is required" })
    .min(0, "Price must be positive"),
  compare_price: z.number().min(0).nullable().optional(),
  stock: z
    .number({ required_error: "Stock is required" })
    .min(0, "Stock must be 0 or more"),
  sku: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isOpen: z.boolean().optional(),
  attrs: z
    .record(z.string(), z.union([z.string(), colorSchema]))
    .nullable()
    .optional(),
});

// ── Sub-schemas ────────────────────────────────────────────────────────────
const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const coverSchema = z.object({
  id: z.number().optional(),
  url: z.string(),
});

const videoSchema = z.object({
  id: z.number().optional(),
  url: z.string(),
});

const dimensionSchema = z.object({
  height: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
});

const inventorySchema = z.object({
  backorderOptions: z.enum(['', 'notify', 'allow']).optional(),
  trackInventory: z.boolean().optional(),
  lowStockThreshold: z.number().min(0).nullable().optional(),
  stockStatus: z.enum(['', 'in_stock', 'out_of_stock', 'discontinued']).optional(),
  weight: z.number().min(0).nullable().optional(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz']).optional(),
  dimensions: z.object({
    length: z.number().min(0).nullable().optional(),
    width:  z.number().min(0).nullable().optional(),
    height: z.number().min(0).nullable().optional(),
    unit:   z.enum(['cm', 'in', 'mm']).optional(),
  }).optional(),
  warehouseLocation: z.string().optional(),
  fulfillmentType: z.enum(['', 'dropship', 'third_party']).optional(),
}).nullable();

const shippingSchema = z.object({
  shippingClass: z.enum(['', 'express', 'pickup']).optional(),
  handlingTime: z.number().min(0).nullable().optional(),
  shippingCostOverride: z.number().min(0).nullable().optional(),
  isReturnable: z.boolean().optional(),
  returnWindow: z.number().optional(),
  returnPolicy: z.enum(['free_return', 'customer_pays']).optional(),
}).nullable();

const metaSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
}).nullable();

const vendorSchema = z.object({
  vendorName: z.string().optional(),
  vendorSku: z.string().optional(),
  vendorNotes: z.string().optional(),
}).nullable();

// ── Main Product Schema ────────────────────────────────────────────────────
export const productSchema = z.object({
  id: z.string().nullable().optional(),
  category_niche_id: z.number().optional(),
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),

  // single product specific
  stock: z.number().nullable(),
  sku: z.string().nullable(),
  price: z.number({ required_error: "Price is required" }).nullable(),
  compare_price: z.number().nullable().optional(),

  sub_categories: z.array(categorySchema).default([]),
  description: z.string().min(1, "Description is required"),
  rating_average: z.number().optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional(),
  isFreeShipping: z.boolean(),
  releaseDate: z.string().optional(),
  madeCountry: z.string(),

  thumbnail: coverSchema.nullable(),
  video: z.array(videoSchema).default([]),
  covers: z.array(coverSchema).default([]),

  inventory: inventorySchema,
  shipping: shippingSchema,
  meta: metaSchema,
  vendor: vendorSchema,

  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),

  variants: z.array(variantSchema).default([]),
  product_attributes: z.array(z.any()).default([]),
  related_products: z.array(z.number()).default([]),

  // settings
  badge_text: z.string().nullable(),
  allow_backorder: z.boolean(),
  show_countdown: z.boolean(),
  show_reviews: z.boolean(),
  show_related_products: z.boolean(),
  show_social_share: z.boolean(),

  // marketing
  promotion_ids: z.array(z.number()).default([]),
  coupon_ids: z.array(z.number()).default([]),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
export type VariantSchemaType = z.infer<typeof variantSchema>;