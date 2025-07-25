<?php

use App\Models\Color;
use App\Models\Fit;
use App\Models\Material;
use App\Models\Product;
use App\Models\Size;
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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Color::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Size::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Material::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Fit::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->integer('quantity')->unsigned();
            $table->timestamps();
            $table->unique(['product_id', 'color_id', 'size_id', 'material_id', 'fit_id'] , 'product_csmf_unique_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
