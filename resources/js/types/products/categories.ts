// Define the type for category codes
export type CategoryCode =
  | "fashion"
  | "electronics"
  | "beauty"
  | "perfumes"
  | "home"
  | "sports"
  | "toys"
  | "jewelry"
  | "baby";

// Interface for a category
export interface Category {
  value: CategoryCode;  // short code for logic / DB
  label: string;       // human-friendly display label
}

