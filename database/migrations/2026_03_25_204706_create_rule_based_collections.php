<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rule_based_collections', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name')->unique(); // e.g., 'deals', 'category'
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            // Core Configs
            $table->json('rules')->nullable();      // Your rules/logic
            $table->json('layout_config')->nullable(); // displayLimit, gap, padding
            $table->json('card_config')->nullable();   // aspectRatio, borderRadius, textAlign
            
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);      // Removed unique() to allow easier re-ordering logic
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rule_based_collections');
    }
};