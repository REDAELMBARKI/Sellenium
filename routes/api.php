<?php
//file name routes/ajax 

use App\Http\Controllers\StripeWebhookController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagsController;

Route::get('/tags/suggest', [TagsController::class, 'suggest'])->name('tags.suggest');
//web hook 

Route::post('api/webhook/stripe', [StripeWebhookController::class, 'handle']);