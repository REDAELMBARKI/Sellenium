<?php 
namespace App\Http\Services;


use App\Models\Material;

class MaterialServices{
  

    public function getVariantMaterialsIdies($variant){

        $material_idies = [];
        
        foreach ($variant['materials'] as $material) {
            if(! empty($material['id'])){
               $material_idies[] = $material['id'];
            }
            
        }
        

        
        if(! empty($material_idies)){
            $ids = Material::whereIn('id', $material_idies)->pluck('id');

        }else{
            $ids = collect();
        }

        
        return $ids;
    }
}