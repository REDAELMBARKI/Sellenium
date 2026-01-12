




import { BaseAttribute } from '@/types/inventoryTypes'
import React from 'react'

export function toBackendDataCleaners() {
  
  
    function cleanAttributesForBackend(
    attributes: Record<string, any>
    ) {
    const cleaned: Record<string, any> = {}
  
    Object.entries(attributes || {}).forEach(([key, value]) => {
      // Array of objects: map to ids
      if (Array.isArray(value)) {
        if (value.length && typeof value[0] === 'object' && 'id' in value[0]) {
          cleaned[key] = value.map((v: { id: number }) => v.id)
        } else {
          // array of primitives (already ids or values)
          cleaned[key] = value
        }
      } else if (value && typeof value === 'object') {
        // Single object with an `id` property: use the id
        if ('id' in value) {
          cleaned[key] = (value as any).id
        } else {
          // plain object without id: keep as-is
          cleaned[key] = value
        }
      } else {
        // primitive value (string, number, boolean, null, undefined)
        cleaned[key] = value
      }
    })
  
    return cleaned
   }
  
   function cleanObjectToIids(itemsWithId : any) {
      if(!itemsWithId) return ;
      try{
        if (Array.isArray(itemsWithId)){
             return itemsWithId.map(e =>  {
               if("id" in e) return  e.id 
               else throw new Error("(cleanObjectToIds) : Array>object has no id to clean ")
             })
        }
        else if("id" in itemsWithId) return  itemsWithId.id  
    
        
      }catch(err : any){
         throw new Error(err.message)
      }
   }
  
  return {
    cleanAttributesForBackend , 
    cleanObjectToIids
  }
}
