import {  Material , Size , Fit , Cover , Color } from "@/types/inventoryTypes";
import { Box } from "lucide-react";
import EmptyListSection from "@/admin/components/partials/EmptyListSection";
import { FashionVariantDisplayCard } from "./displayVariantCards/FashionVariantDisplayCard";
import { ProductVariant } from "@/types/productsTypes";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { fakeFashionVariants, fakeParfumesVariants } from "@/data/fakeVariants";
import { useNicheCtx } from "@/contextHooks/useNicheCtx";
import { NicheItem } from '@/context/NicheContext';
import { ParfumesVariantDisplayCard } from "./displayVariantCards/ParfumesVariantDisplayCard";







export const VariantsSection = () => {
 
   
    const {currentNiche} = useNicheCtx()

    const VariantsDisplayCardsMap : Record<NicheItem , React.FC<any>>  = {
       "fashion" : FashionVariantDisplayCard , 
       "parfumes" : ParfumesVariantDisplayCard , 
       "electronics" : FashionVariantDisplayCard , 
    }


    const VariantDisplayCard = VariantsDisplayCardsMap[currentNiche]
    
    return (
        <div className="rounded-xl shadow-md border border-slate-200 " 
        style={{padding : "10px"}}
        >
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

            <div className="p-8 flex flex-col gap-4">
                {fakeParfumesVariants?.length > 0 ? (
                    fakeParfumesVariants.map((variant) => {
                    
                        return (
                            <VariantDisplayCard
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
