import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Package } from "lucide-react";
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useProductUICtx } from '@/contextHooks/product/useProductUICtx';
import BasicInfoFormMaster from './ProductFormMaster';
import GoCreateProduct from '@/components/partials/GoCreateProduct';
import { useToast } from '@/contextHooks/useToasts';
import { ProductBase } from '@/types/products/baseProductTypes';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

const ProductBasicInfoRouter: React.FC = () => {
  const { basicInfoForm, productData = {} as ProductBase, setProductData, modeForm } = useProductDataCtx();
  const { hasUnsavedChanges, setHasUnsavedChanges } = useProductUICtx();
  const { addToast } = useToast();
  const toastShownRef = useRef<boolean>(false);
  const {state : {currentTheme}} = useStoreConfigCtx();
  // ── track unsaved changes ─────────────────────────────────────────────────
  useEffect(() => {
    if (!productData) return;
    const hasChanges = JSON.stringify(productData) !== JSON.stringify(basicInfoForm);
    setHasUnsavedChanges(hasChanges);
  }, [basicInfoForm]);

  // ── toast on first mount if there are unsaved changes ────────────────────
  useEffect(() => {
    if (toastShownRef.current) return;
    if (hasUnsavedChanges) {
      addToast({
        title: "There are unsaved changes",
        description: "Save your changes or they will be lost.",
        type: "info",
        duration: 100000,
      });
    }
    toastShownRef.current = true;
  }, [basicInfoForm]);

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setProductData({ ...productData, ...basicInfoForm });
    setHasUnsavedChanges(false);
  };

  return (
    <div
      className="rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border, padding: '2.5rem' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: currentTheme.border }}>
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: currentTheme.accent }}
          >
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: currentTheme.text }}>
              Basic Information
            </h2>
            {hasUnsavedChanges && (
              <p className="text-xs mt-1" style={{ color: '#f59e0b' }}>
                Unsaved changes
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: currentTheme.primary, color: '#ffffff' }}
        >
          <Check className="w-4 h-4" />
          Save
        </Button>
      </div>

      {/* Body */}
      {modeForm === "edit" || modeForm === "create" ? (
        <BasicInfoFormMaster />
      ) : (
        <GoCreateProduct title="No product Found" description="" />
      )}
    </div>
  );
};

export default ProductBasicInfoRouter;