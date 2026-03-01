<?php


namespace App\Services\product;

use App\Models\Coupon;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Tag;
use App\Services\MediaService;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\In;

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
    
    private function syncSubCategories(Product $product , array $subCategories  ){
        $product->subCategories()->sync($subCategories) ;
    }

    private function syncTags(Product $product , Collection $tagsIds){
        $product->tags()->sync($tagsIds) ;
    }
     
    public function prepareProductPayload(array $payload) : array
    {
      $data = array_merge(
        [
            'faqs'                  => [],
            'related_product_ids'   => [],
            'subCategories'         => [],
            'tags'                  => [],
            'isFeatured'            => false,
            'isFreeShipping'        => false,
            'allow_backorder'       => false,
            'show_countdown'        => true,
            'show_reviews'          => true,
            'show_related_products' => true,
            'show_social_share'     => true,
            'inventory'             => null,
            'shipping'              => null,
            'meta'                  => null,
            'vendor'                => null,
        ],
        $payload
      ) ;

      return $data ;
    }
    public function saveDraft($payload ,?Product $product) {
        $product = $product ?? new Product();
        // product is created (not null anymore ) ;
        return DB::transaction(function() use ($product , $payload){
            $payload = $this->prepareProductPayload($payload);
            $payload = $this->slugProduct($payload, $product);
            $product->fill($payload) ;
            $product->save();
            // save tags
            $ids = $this->storeTags(collect($payload['tags']));
            $this ->syncTags($product , $ids); // sync tags to the product/product
            $this ->syncSubCategories($product , $payload['subCategories'] ?? [] ) ;
            //store vedio iframe url if exists
            $this->mediaService->storeIframeVideo($product , $payload['video']);
            // store variants
            $updatedVariants = $this -> resolveVariants($payload);
            $this-> syncVariants($product ,$updatedVariants );
            $this->evaluateProductScore($product);
            // coupons and promotions related to this product
            $this->attachApplicableProducts($product, $payload['promotion_ids'] ?? [], Promotion::class);
            $this->attachApplicableProducts($product, $payload['coupon_ids'] ?? [], Coupon::class);
        
            return $product->fresh();
        });
    }

    private function slugProduct(array $payload, Product $product): array
    {
        if (!$product->exists) {
            $payload['slug'] = $this->generateSlug($payload['name']);
        }
        return $payload;
    }

    public function updateDraft($payload , Product $product){
       return   $this->saveDraft($payload , $product) ;
    }

    public function isPublishable(Product $product) : bool
    {
        return !empty($product->name)
        && !empty($product->description)
        && !empty($product->thumbnail)
        && !empty($product->category_id)
        && $product->quality_score >= 50;
    }

    public function syncVariants(Product $product, array $variants): void
    {
        $existingSkus = collect($variants)->pluck('sku')->filter();
        $product->variants()->whereNotIn('sku', $existingSkus)->delete(); 
        

        ProductVariant::upsert(
                    collect($variants)->map(function($variant) use ($product) {
                         $uniqueSku  =  $variant['sku'] ?? $this->generateSku($product , $variant['attrs'] ) ;
                         return [
                            'product_id' => $product->id ,
                            'price' => Arr::get($variant,'price'),
                            'compare_price'=> Arr::get($variant,'compare_price'),
                            'stock'=> Arr::get($variant,'stock'),
                            'sku'=>  $uniqueSku,
                            'attrs' =>json_encode(Arr::get($variant, 'attrs')),
                            'is_default'    => $variant['is_default'] ?? false,
                            'created_at'    => now(),
                            'updated_at'    => now(),
                        ] ;
                    })->toArray(),
                    ['sku'] ,
                    ['price', 'compare_price', 'is_default',  'stock', 'attrs', 'updated_at']
                  );
    }

    private function resolveVariants(array $payload) : array{
        $updatedVariants = $payload['variants'] ;
        if(!empty($updatedVariants)){
            $hasDefault = collect($updatedVariants)->where('is_default', true)->count();
            abort_if($hasDefault > 1, 422, 'Only one variant can be default');
            // If none marked as default → make first one default
            if ($hasDefault === 0) {
                $updatedVariants[0]['is_default'] = true;
            }
        }
        else{
           $updatedVariants = [[
                  'price' => $payload['price'] ,
                  'compare_price' => $payload['compare_price'] ,
                  'sku' => $payload['sku'],
                  'stock' => $payload['stock'] ,
                  'attrs' => []  ,
                  'is_default' => true ,
           ]] ;
        }
        return $updatedVariants;
    }
    private function generateSku(Product $product, array $attrs, int $maxAttempts = 5): string
    {
        $base = strtoupper(Str::slug($product->name, '-')); // BLUE-TSHIRT
        
        $attrPart = !empty($attrs) ?
            collect($attrs)
            ->map(fn ($attr) => strtoupper($attr['value']) ?? 'DEFAULT')
            ->join('-')
            : 'DEFAULT'
            ; // RED-XL

        for ($i = 0; $i < $maxAttempts; $i++) {
            $sku = $base . '-' . $attrPart . '-' . strtoupper(Str::random(4));
            // BLUE-TSHIRT-RED-XL-AX7K

            if (!ProductVariant::where('sku', $sku)->exists()) {
                return $sku;
            }
        }

        throw new \RuntimeException('Failed to generate unique SKU, please try again.');
    }

    private function generateSlug(string $name): string
    {
        $slug = Str::slug($name);

        // Check if base slug is available first
        if (!Product::where('slug', $slug)->exists()) {
            return $slug;
        }

        // Keep trying until unique
        for ($i = 0; $i < 5; $i++) {
            $newSlug = $slug . '-' . strtolower(Str::random(4));
            
            if (!Product::where('slug', $newSlug)->exists()) {
                return $newSlug;
            }
        }

        throw new \RuntimeException('Failed to generate unique slug, please try again.');
    }

    public function evaluateProductScore (Product $product): int
    {

        // Optional fields - boost quality score
        $score = 0;
        if ($product->variants()->exists())      $score += 30; // most important ✅
        if ($product->thumbnail()->exists())    $score += 10; // drives sales
        if ($product->covers()->count() >= 2)    $score += 15; // drives sales
        if (strlen($product->description) > 200) $score += 20; // rich content
        if ($product->subCategories()->exists()) $score += 15; // navigation
        if ($product->tags()->exists())          $score += 10; // SEO
        $product->quality_score = $score;
        $product->save();

        return $score;
    }

    public function publish(Product $product): void
    {
        
        $product->update([
            'status' => 'published'
        ]);

        Media::where('mediaable_id' , $product->id)
                         ->each(function($media){
                             $media->update([
                                 'is_temporary' => false
                             ]) ;
        });
    }

   private function attachApplicableProducts(Product $product, array $ids, string $model): void
    {
        $items = $model::whereIn('id', $ids)->get();
        $relatedItems = $model::whereJsonContains('applicable_product_ids', $product->id)->get();
        // Remove product from deselected
         foreach ($relatedItems as $item) {
            if (!in_array($item->id, $items->pluck('id')->toArray())) {
                $item->update([
                    'applicable_product_ids' => collect($item->applicable_product_ids)
                        ->reject(fn($id) => $id === $product->id)
                        ->toArray()
                ]);
            }
        }
        // Add product to new ones
        $items->reject(fn($item) => in_array($item->id, $relatedItems->pluck('id')->toArray()))
            ->each(fn($item) => $item->update([
                'applicable_product_ids' => collect($item->applicable_product_ids)
                                                ->push($product->id)
            ]));
    }






}//class close tag
