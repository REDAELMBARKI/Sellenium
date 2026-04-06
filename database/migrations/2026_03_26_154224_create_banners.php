<?php

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
      Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('key')->index();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('direction', 3)->default('ltr'); 
            $table->string('aspect_ratio')->default('21:9');
            $table->string('border_radius')->default('12px');
            $table->string('bg_color')->default('#ffffff');

            $table->boolean('is_active')->default(true);
            $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
