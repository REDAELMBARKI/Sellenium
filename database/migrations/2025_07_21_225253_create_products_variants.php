<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class)->constrained()->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->decimal('oldPrice', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->string('sku')->unique()->nullable();
            
            // Store all attributes as JSON
            $table->json('attributes')->nullable(); // {"color": "red", "storage": "32GB"}
            
            // Virtual columns for common searchable attributes (optional, for performance)
            $table->string('color')->nullable()->virtualAs("JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.color'))");
            $table->string('size')->nullable()->virtualAs("JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.size'))");
            
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            
            // Index virtual columns for fast filtering
            $table->index('color');
            $table->index('size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products_variants');
    }
};
