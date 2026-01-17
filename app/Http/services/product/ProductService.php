<?php


namespace App\Http\Services;

use App\Http\Requests\PublishProductRequest;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService {
   
    public function storeTags(array $tags) : Collection
    {
        
        if (empty($tags)) {
            return collect();
        }

        $tags = collect($tags)
            ->map(fn ($tag) => trim(strtolower($tag)))
            ->filter()
            ->unique()
            ->values();

        if ($tags->isEmpty()) {
            return collect();
        }

        Tag::upsert(
            $tags->map(fn ($tag) => [
                'name' => $tag,
                'slug' => Str::slug($tag),
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray(),
            ['name'],                 // unique key
            []    // dont update any  columns
        );

        return Tag::whereIn('name' , $tags)->pluck('id') ;
    }

    public function saveDraft($payload , ?Product $draft) {
        $draft = $draft ?? new Product();
        return DB::transaction(function() use ($draft , $payload){
            $draft->fill($payload) ;
            $draft->save();
            // save tags
            $ids = $this->storeTags($payload['tags']);
            if($ids->isNotEmpty()){
                $draft->tags()->sync($ids) ;
            }
            return $draft->fresh();
        });
    }

    public function isPublishable(Product $product) : bool
    {
        return $product->quality_score >= 50   &&
              $product->ready_to_publish ;
    }
}
