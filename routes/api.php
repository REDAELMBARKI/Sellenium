<?php
//file name routes/ajax 

use App\Http\Controllers\HomeLayoutOrcController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::get('/tags/suggest', [TagController::class, 'suggest'])->name('tags.suggest');
Route::get('/products/suggest', [ProductController::class, 'suggest'])->name('products.suggest');
//web hook

Route::post('api/webhook/stripe', [StripeWebhookController::class, 'handle']);



// get enough products depends on the page x width screen 
Route::get('api/collections/products/batch', [HomeLayoutOrcController::class, 'getLimitedCollectionProducts'])->name('collections.limited-products');