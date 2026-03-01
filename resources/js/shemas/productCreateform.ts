// schemas/productSchema.ts

import { z } from "zod";

// ── Variant Schema ─────────────────────────────────────────────────────────
const colorSchema = z.object({
  hex: z.string().min(1, "Color hex is required"),
  name: z.string().min(1, "Color name is required"),
});

export const variantSchema = z.object({
  id: z.string().optional(),
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
  imageUrl: z.string().url("Image URL must be a valid URL"),
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

const coverSchema = z.object({
  id: z.number().optional(),
  url: z.string().min(1, "Cover URL is required").url("Cover URL must be a valid URL"),
});

const videoSchema = z.object({
  id: z.number().optional(),
  url: z.string().min(1, "Video URL is required").url("Video URL must be a valid URL"),
});

const inventorySchema = z.object({
  backorderOptions: z.enum(['deny', 'notify', 'allow'], {
    required_error: "Backorder option is required",
    invalid_type_error: "Invalid backorder option",
  }),
  trackInventory: z.boolean({ required_error: "Track inventory is required" }),
  lowStockThreshold: z
    .number({ invalid_type_error: "Low stock threshold must be a number" })
    .min(0, "Low stock threshold must be 0 or more")
    .nullable(),
  stockStatus: z.enum(['', 'in_stock', 'out_of_stock', 'discontinued'], {
    required_error: "Stock status is required",
    invalid_type_error: "Invalid stock status",
  }),
  weight: z
    .number({ invalid_type_error: "Weight must be a number" })
    .min(0, "Weight must be 0 or more")
    .nullable(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz'], {
    required_error: "Weight unit is required",
    invalid_type_error: "Invalid weight unit",
  }),
  dimensions: z.object({
    length: z
      .number({ invalid_type_error: "Length must be a number" })
      .min(0, "Length must be 0 or more")
      .nullable(),
    width: z
      .number({ invalid_type_error: "Width must be a number" })
      .min(0, "Width must be 0 or more")
      .nullable(),
    height: z
      .number({ invalid_type_error: "Height must be a number" })
      .min(0, "Height must be 0 or more")
      .nullable(),
    unit: z.enum(['cm', 'in', 'mm'], {
      required_error: "Dimension unit is required",
      invalid_type_error: "Invalid dimension unit",
    }),
  }),
  warehouseLocation: z.string().min(1, "Warehouse location is required"),
  fulfillmentType: z.enum(['', 'dropship', 'third_party'], {
    required_error: "Fulfillment type is required",
    invalid_type_error: "Invalid fulfillment type",
  }),
});

const shippingSchema = z.object({
  shippingClass: z.enum(['', 'express', 'pickup'], {
    required_error: "Shipping class is required",
    invalid_type_error: "Invalid shipping class",
  }),
  handlingTime: z
    .number({ invalid_type_error: "Handling time must be a number" })
    .min(0, "Handling time must be 0 or more")
    .nullable(),
  shippingCostOverride: z
    .number({ invalid_type_error: "Shipping cost must be a number" })
    .min(0, "Shipping cost must be 0 or more")
    .nullable(),
  isReturnable: z.boolean({ required_error: "isReturnable is required" }),
  returnWindow: z
    .number({ required_error: "Return window is required", invalid_type_error: "Return window must be a number" })
    .min(0, "Return window must be 0 or more"),
  returnPolicy: z.enum(['free_return', 'customer_pays'], {
    required_error: "Return policy is required",
    invalid_type_error: "Invalid return policy",
  }),
});

const metaSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
});

const vendorSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  vendorSku: z.string().min(1, "Vendor SKU is required"),
  vendorNotes: z.string().optional(),
});

// ── Main Product Schema ────────────────────────────────────────────────────
export const productSchema = z.object({
  id: z.string().nullable().optional(),
  category_niche_id: z.number({ required_error: "Category niche is required" }),
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),

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
  rating_average: z.number({ invalid_type_error: "Rating must be a number" }).min(0).max(5, "Rating must be between 0 and 5").optional(),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
  isFeatured: z.boolean({ required_error: "isFeatured is required" }),
  isFreeShipping: z.boolean({ required_error: "isFreeShipping is required" }),
  releaseDate: z.string().min(1, "Release date is required"),
  madeCountry: z.string().min(1, "Country of origin is required"),

  thumbnail: coverSchema,
  video: z.array(videoSchema).default([]),
  covers: z.array(coverSchema).min(1, "At least one cover image is required"),

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