<?php


namespace App\Services\product;

use App\Models\Product;
use App\Models\Tag;
use App\Services\MediaService;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService {

    
   public function __construct(private MediaService $mediaService) {}
    public function storeTags(Collection $tags) : Collection
    {
        
        if ($tags->isEmpty()) {
            return collect();
        }

        $tags = $tags
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
    
    private function syncSubCategories(Product $product , Collection $subCategories){
        if(!$product || $subCategories->isEmpty()){
            return ;
        }
        $product->subCategories()->sync($subCategories) ;
    }

    private function syncTags(Product $product , Collection $tagsIds){
        if(!$product || $tagsIds->isEmpty()){
            return ;
        }
        $product->tags()->sync($tagsIds) ;
    }

    public function saveDraft($payload , Product $draft) {
        $draft = $draft ?? new Product();
        // draft is created (not null anymore ) ;
        return DB::transaction(function() use ($draft , $payload){
            $draft->fill(Arr::except($payload, [
                'tags',
                'subCategories',
            ])) ;
            $draft->save();
            // save tags
            $ids = $this->storeTags(collect($payload['tags']));
            $this ->syncTags($draft , $ids); // sync tags to the product/draft
            $this ->syncSubCategories($draft , collect($payload['subCategories'])) ;
            //store vedio iframe url if exists
            $this->mediaService->storeIframeVideo($draft , $payload['video']);
            // store variants
            $this-> storeVariants($draft , $payload['variants']);
            return $draft->fresh();
        });
    }

    public function updateDraft($payload , Product $product){
       return   $this->saveDraft($payload , $product) ;
    }

    public function isPublishable(Product $product) : bool
    {
        return $product->quality_score >= 50   &&
              $product->ready_to_publish ;
    }


    public function storeVariants(Product $product , array $variants){
         collect($variants)->each(function ($variant) use ($product){
                 $product->variants()->create([
                        'price'       => $variant['price'],
                        'stock'      => $variant['stock'],
                        'sku'      => $variant['sku'],
                        'compare_price' => $variant['compare_price'],
                        'attrs'      => $variant['attrs'],
                 ]);
         });
    }
    public function checkReadiness() : void {}


}
