<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    
  
    public function get_niche_cats(){
        return  Category::where('parent_id' , null)->get(['id' , 'name']) ;
    }

   
    public function store(array $data): Category {
        return Category::create([
            'name'      => $data['name'],
            'slug'      => str($data['name'])->slug(),
            'parent_id' => $data['parent_id'] ?? null,
        ]);
    }

    public function update(int $id, array $data): Category {
        $category = Category::findOrFail($id);
        $category->update([
            'name'      => $data['name'] ?? $category->name,
            'slug'      => isset($data['name']) ? str($data['name'])->slug() : $category->slug,
            'parent_id' => $data['parent_id'] ?? $category->parent_id,
        ]);
        return $category;
    }

    public function delete(int $id): void {
        Category::findOrFail($id)->delete();
    }
}
