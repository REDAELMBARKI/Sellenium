<?php

use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderManagement;
use App\Http\Controllers\admin\VariantsManagement;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');
Route::get('/shop', function () {
    return Inertia::render('ShopPage');
})->name('shop');
Route::get('/about', function () {
    return Inertia::render('AboutPage');
})->name('about');
Route::get('/contact', function () {
    return Inertia::render('ContactPage');
})->name('contact');
Route::get('/blog', function () {
    return Inertia::render('BlogPage');
})->name('blog');





// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// products 
// Route::resource('/products', ProductController::class );
Route::get('/products/create' , [ProductController::class, 'create']) ;
Route::get('/products/edit' , [ProductController::class, 'edit']) ;
Route::get('/products/list' , [ProductController::class, 'index']) ;


// admin
Route::get('/admins' , [AdminController::class, 'index']) ;

// categories
Route::get('/categories' , [CategoryController::class, 'index']) ;



// variants managment

Route::get('/variants/colors' , [VariantsManagement::class, 'colors']) ;
Route::get('/variants/sizes' , [VariantsManagement::class, 'sizes']) ;



// oderes
// OrderManager
Route::get('/orders' , [OrderManagement::class, 'index']) ;

// require __DIR__.'/auth.php';
