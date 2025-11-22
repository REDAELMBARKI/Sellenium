import { useInventory } from '@/contextHooks/useInventory';
import { useMedia } from '@/contextHooks/useMedia';
import { useProductForm } from '@/contextHooks/useProductForm';
import { useTags } from '@/contextHooks/useTags';
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
