import { Color, Country, Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { CategoryCode } from "@/types/products/categories";

export const CATEGORY_CONFIG : Record<CategoryCode , any> = {
  fashion: {
    attributes: {
      season: [] as Season[],
      styles: [] as Style[],
      fits: [] as Fit[],
      materials: [] as Material[],
      gender: [] as Gender[],
    },
  },

  perfumes: {
    attributes: {
      concentration: "EDT" as const,
      fragranceFamily: "fresh" as const,
      topNotes: [] as string[],
      middleNotes: [] as string[],
      baseNotes: [] as string[],
      volumes: [] as { volume: number; price: number }[],
      gender: [] as Gender[],
    },
  },

  electronics: {
    attributes: {
      batteryLife: "",
      connectivity: [] as string[],
      voltage: "",
      storage: "",
      colors: [] as Color[],
      warrantyMonths: undefined as number | undefined,
    },
  },
} as const;
