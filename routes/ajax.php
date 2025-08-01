<?php

use App\Http\Controllers\TagsController;
use Illuminate\Support\Facades\Route;

Route::get("/tags/suggest", [TagsController::class , 'suggest'] );