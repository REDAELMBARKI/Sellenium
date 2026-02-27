
import React, { useEffect } from 'react';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Button } from '@/components/ui/button';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import adapters from '@/functions/product/adapters';
import { Inertia } from '@inertiajs/inertia'
import { route } from 'ziggy-js';
import axios from 'axios';
import { ProductBase } from '@/types/products/baseProductTypes';

const ProductFormMaster: React.FC = () => {
  const { state: { currentTheme } } = useStoreConfigCtx()
  const { modeForm, draftId, handleSubmit: formHandleSubmit, watch } = useProductDataCtx()
  const { toBackendAttribute } = adapters();

  function cleanAttributesForBackend(attributes: Record<string, any>) {
    const cleaned: Record<string, any> = {}
    Object.entries(attributes).forEach(([key, value]) => {
      if (
        Array.isArray(value) &&
        value.length &&
        typeof value[0] === 'object' &&
        'id' in value[0]
      ) {
        cleaned[key] = value.map((v: { id: number }) => v.id)
      } else {
        cleaned[key] = value
      }
    })
    return cleaned
  }

  // useEffect(() => {
  //   if (draftId.current) return;

  //   const draftInit = async () => {
  //     try {
  //       const res = await axios.post(route('products.storeDraft'));
  //       draftId.current = res.data.id;
  //     } catch (error) {
  //       console.error("Failed to create draft:", error);
  //     }
  //   };

  //   draftInit();
  // }, []);

  const onSubmit = (data: ProductBase) => {
    const payload = {
      ...data,
      product_attributes: cleanAttributesForBackend(data.product_attributes),
    }

    Inertia.put(route('product.update', { product: draftId.current }), payload as any, {
      onSuccess: () => console.log('Success'),
      onError: (errors) => console.error(errors),
    })
  }

  return (
    <form onSubmit={formHandleSubmit(onSubmit)}>
      {/* edit and create form */}
      <div className='flex'>
        <pre style={{ fontSize: 11, background: '#111', color: '#0f0', padding: 12 }}>
  {JSON.stringify(watch(), null, 2)}
</pre>
        <ProductCrEdForm />
        <RightSectionComponent />
      </div>

      {/* save product */}
      <div
        className="sticky bottom-0 z-30 flex justify-end px-6 py-4 border-t backdrop-blur"
        style={{
          background: currentTheme.bgSecondary,
          borderColor: currentTheme.border,
        }}
      >
        <Button
          type="submit"
          className="min-w-[220px] text-sm font-semibold rounded-lg shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          style={{
            background: currentTheme.primary,
            color: currentTheme.textInverse,
          }}
        >
          <Save />
          {modeForm === "create" ? "Create Product" : "Update Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductFormMaster;