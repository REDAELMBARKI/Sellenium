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
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Color::class)->constrained()->cascadeOnUpdate();
            $table->foreignIdFor(Size::class)->constrained()->cascadeOnUpdate();
            $table->foreignIdFor(Material::class)->constrained()->cascadeOnUpdate();
            $table->foreignIdFor(Fit::class)->constrained()->cascadeOnUpdate();
            $table->integer('quantity')->unsigned();
            $table->timestamps();
            $table->unique(['product_id', 'color_id', 'size_id', 'material_id', 'fit_id']);
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
