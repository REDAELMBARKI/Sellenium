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
  errors: z.record(z.string(), z.array(z.string())).nullable().optional(),
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
  quantity: z.number().optional(),
  sku: z.string().optional(),
  backorderOptions: z.string().optional(),
}).nullable();

const shippingSchema = z.object({
  weight: z.number().optional(),
  dimensions: dimensionSchema.optional(),
  shippingClass: z.string().optional(),
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
});

export type ProductSchemaType = z.infer<typeof productSchema>;
export type VariantSchemaType = z.infer<typeof variantSchema>;