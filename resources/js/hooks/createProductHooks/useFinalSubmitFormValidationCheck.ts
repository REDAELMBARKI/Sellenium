import { useInventory } from '@/contextHooks/createProductCtxHooks/useInventory';
import { useMedia } from '@/contextHooks/createProductCtxHooks/useMedia';
import { useProductForm } from '@/contextHooks/createProductCtxHooks/useProductForm';
import { useTags } from '@/contextHooks/createProductCtxHooks/useTags';
import React, { useEffect } from 'react'

export const  useFinalSubmitFormValidationCheck =  () => {

  const {setIsReadyToSubmit , otherStringFieldsValid } = useProductForm()
  const {tagsValid } = useTags()
  const {inventoryValid} = useInventory()
  const {imagesValid} = useMedia()
 useEffect(() => {
        setIsReadyToSubmit((prev) => ({
            ...prev,
            bool: [
                otherStringFieldsValid,
                imagesValid,
                tagsValid,
                inventoryValid,
            ].every((section) => section === true),
        }));
    }, [otherStringFieldsValid, imagesValid, tagsValid, inventoryValid]);

}
