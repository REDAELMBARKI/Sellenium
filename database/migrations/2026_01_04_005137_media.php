<?php

use App\Models\Inventory;
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
   
    Schema::create('media', function (Blueprint $table) {
        $table->id();

        
        $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        
        $table->string('collection');
        // thumbnail, gallery, avatar, variant_cover, banner
        $table->string('path');
        
        $table->string('disk')->default('public');
        $table->string('mime_type')->nullable();
        
        $table->nullableMorphs('model'); // model_type + model_id
        $table->unsignedBigInteger('size')->nullable();
        $table->unsignedInteger('width')->nullable();
        $table->unsignedInteger('height')->nullable();

        $table->boolean('is_temporary')->default(false);
        $table->integer('order')->default(0);

        $table->timestamps();

        $table->index(['is_temporary', 'collection']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
