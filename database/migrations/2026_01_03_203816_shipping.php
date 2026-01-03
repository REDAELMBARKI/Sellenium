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
        Schema::create('shipping' , function(Blueprint $table) {
         $table->id() ;
         $table->foreignId('product_id')->constrained('products')->cascadeOnDelete() ;
         $table->string('is_Free_Shipping')  ;
         $table->string('dimensions') ; 
         $table->string('weight') ; 
         $table->string('shipping_class') ;

        }) ;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
