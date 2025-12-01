import { InventoryOptions } from "@/types/inventoryTypes";
import { Variant } from "@/types/productsTypes";
import { Box } from "lucide-react";
import { VariantDisplay } from "./VariantDisplay";
import EmptyListSection from "@/admin/components/partials/EmptyListSection";





interface VariantsSectionProps {
    variants: Variant[];
}

export const VariantsSection = ({
    variants,
}: VariantsSectionProps) => {


   


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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {variants?.length > 0 ? (
                    variants.map((variant) => {
                    
                        return (
                            <VariantDisplay 
                                
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
