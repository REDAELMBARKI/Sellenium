import React, { useEffect, useRef, useState } from 'react';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Button } from '@/components/ui/button';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { route } from 'ziggy-js';
import axios from 'axios';
import { ProductSchemaType } from '@/shemas/productSchema';
import { router } from '@inertiajs/react';
import LeaveModal from '@/components/ui/LeaveModel';
import { useBackendInteraction } from '@/functions/product/useBackendInteractions';
import { toBackendDataCleaners } from '@/functions/product/toBackendDataCleaners';
import { isEmpty } from 'lodash';
import AppLoading from '@/components/AppLoading';

const ProductFormMaster: React.FC = () => {
  const { state: { currentTheme } } = useStoreConfigCtx();
  const {
    modeForm,
    draftId,
    handleSubmit: formHandleSubmit,
    watch,
    getValues,
    formState: { isSubmitting, isDirty, errors },
  } = useProductDataCtx();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingVisit, setPendingVisit]     = useState<string | null>(null);
  const [isLoading, setIsLoading]           = useState(false); // 👈 loading state
  const [loadingMessage, setLoadingMessage] = useState('Saving product');

  const { cleanAttributesForBackend } = toBackendDataCleaners();
  const { save, destroyDraftProduct }  = useBackendInteraction();
  const isLeavingRef = useRef(false);

  // ─── Init draft ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (draftId.current) return;
    const draftInit = async () => {
      try {
        const res = await axios.post(route('products.storeDraft'));
        draftId.current = res.data.id;
      } catch (error) {
        console.error('Failed to create draft:', error);
      }
    };
    draftInit();
  }, []);

  // ─── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: ProductSchemaType) => {
    setIsLoading(true);
    setLoadingMessage(modeForm === 'create' ? 'Creating product...' : 'Updating product...');
    isLeavingRef.current = true;
    router.put(
      route('draft.save.submit', { product: draftId.current }),
      data as any,
      {
        onSuccess: () => {
          setIsLoading(false); 
        },
        onError: (errs) => {
          console.log('Validation errors:', errs);
          isLeavingRef.current = false;
          setIsLoading(false); 
        },
        onFinish: () => {
          setIsLoading(false); 
        },
      }
    );
  };

  // ─── Unload guard ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLeavingRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ─── Inertia nav guard ─────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = router.on('before', (event) => {
      if (!isLeavingRef.current) {
        setShowLeaveModal(true);
        setPendingVisit(event.detail.visit.url.toString());
        event.preventDefault();
      }
    });
    return () => unsubscribe();
  }, [isDirty]);

  // ─── Leave modal handlers ──────────────────────────────────────────────────

  const handleConfirmLeave = () => {
    const data    = getValues();
    const payload = {
      ...data,
      product_attributes: cleanAttributesForBackend(data.product_attributes),
    };

    setIsLoading(true);
    setLoadingMessage('Saving draft...');

    save(
      'draft.save.leave',
      payload,
      (errors) => {
        console.log(errors);
        setIsLoading(false);
      },
      draftId.current
    );

    isLeavingRef.current = true;
    setShowLeaveModal(false);
    if (pendingVisit) router.visit(pendingVisit);
  };

  const handleCancelLeave = () => {
    destroyDraftProduct(draftId.current!);
    isLeavingRef.current = true;
    setShowLeaveModal(false);
    if (pendingVisit) router.visit(pendingVisit);
    setPendingVisit(null);
  };

  const handleCancel = () => {
    setShowLeaveModal(false);
    setPendingVisit(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* App-wide loading overlay */}
      {isLoading && <AppLoading message={loadingMessage} />}

      <form
        onSubmit={ (e) => { 
          e.preventDefault();
          formHandleSubmit(onSubmit , (errors) => {
              console.log(errors)
          })();
        }}
      >
        {showLeaveModal && (
          <LeaveModal
            theme={currentTheme}
            onClose={handleCancel}
            onLeave={handleCancelLeave}
            onSaveDraft={handleConfirmLeave}
          />
        )}

        <div className="flex">
          <ProductCrEdForm />
          <RightSectionComponent />
        </div>

        {/* Submit bar */}
        <div
          className="sticky bottom-0 z-30 flex justify-end px-6 py-4 border-t backdrop-blur"
          style={{
            background: currentTheme.bgSecondary,
            borderColor: currentTheme.border,
          }}
        >
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}  // 👈 fixed condition
            className="min-w-[220px] text-sm font-semibold rounded-lg shadow-lg transition hover:opacity-90 active:scale-[0.98]"
            style={{
              background: currentTheme.primary,
              color: currentTheme.textInverse,
            }}
          >
            <Save className="mr-2" size={16} />
            {isLoading || isSubmitting
              ? 'Submitting...'
              : modeForm === 'create'
              ? 'Create Product'
              : 'Update Product'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductFormMaster;