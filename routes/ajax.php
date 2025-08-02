<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagsController;

Route::get('/tags/suggest', [TagsController::class, 'suggest'])->name('tags.suggest');
