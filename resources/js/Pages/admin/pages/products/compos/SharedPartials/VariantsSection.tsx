import {  Material , Size , Fit , Cover , Color } from "@/types/inventoryTypes";
import { Box } from "lucide-react";
import EmptyListSection from "@/admin/components/partials/EmptyListSection";
import { FashionVariantDisplayCard } from "./displayVariantCards/FashionVariantDisplayCard";
import { ProductVariant } from "@/types/productsTypes";







export const VariantsSection = () => {

const variants: ProductVariant[] = [
  { 
    niche : "fashion" ,
    id: "1",
    quantity: 10,
    attributes: {
      color: [{ id: 1, hex: "#FF0000", name: "Red" }] as Color[] , 
      sizes: [
        { id: 1, name: "S" },
        { id: 2, name: "M" },
        { id: 3, name: "L" }
      ] as Size[],
      fits: [{ id: 1, name: "regular" }] as Fit[],
      materials: [{ id: 1, name: "Cotton" }] as Material[],
      fabricType: ["Jersey"],
       covers: [
        { id: 1, path: "/images/red-front.jpg" },
        { id: 2, path: "/images/red-back.jpg" }
      ] as Cover[]
    }
  },
  { 
    niche : "fashion" ,

    id: "2",
    quantity: 5,
    attributes: {
      color:[ { id: 2, hex: "#0000FF", name: "Blue" }] as Color[],
      sizes: [
        { id: 2, name: "M" },
        { id: 3, name: "L" },
        { id: 4, name: "XL" }
      ] as Size[],
      fits: [{ id: 2, name: "slim" }] as Fit[],
      materials: [
        { id: 1, name: "Cotton" },
        { id: 2, name: "Polyester" }
      ] as Material[],
      fabricType: ["Jersey"],
      covers : [{ id: 1, path: "/images/red-front.jpg" },
        { id: 2, path: "/images/red-back.jpg" }] as Cover[]

    }
  },
  { 
    niche : "fashion" ,
    id: "3",
    quantity: 7,
    attributes: {
      color: [{ id: 3, hex: "#00FF00", name: "Green" }] as Color[],
      sizes: [
        { id: 1, name: "S" },
        { id: 2, name: "M" }
      ] as Size[],
      fits: [{ id: 3, name: "oversized" }] as Fit[],
      materials: [{ id: 1, name: "Cotton" }] as Material[],
      fabricType: ["Sweatshirt"],
      covers : [{ id: 1, path: "/images/red-front.jpg" },
        { id: 2, path: "/images/red-back.jpg" }] as Cover[]
    }
  }
];


    return (
        <div className="rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Variants</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {variants?.length > 0 ? (
                    variants.map((variant) => {
                    
                        return (
                            <FashionVariantDisplayCard
                                key={variant.id}
                                variant={variant}
                               
                            />
                        );
                    })
                ) : (
                    <EmptyListSection
                        Icon={Box}
                        label="Product variants"
                        description="No Variant for this product"
                    />
                )}
            </div>
        </div>
    );
};
