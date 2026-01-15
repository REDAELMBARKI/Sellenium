<?php

use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\CurstomerController;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\MessageController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\StoreConfigController;
use App\Http\Controllers\admin\VariantsController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\OrderController;
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
Route::get('/products/drafts' , [ProductController::class, 'draft']) ;
Route::get('/products/edit' , [ProductController::class, 'edit']) ;
Route::get('/products' , [ProductController::class, 'index'])->name('products') ;
Route::get('/products/show' , [ProductController::class, 'show']) ;
Route::post('/products' , [ProductController::class, 'createDraft'])->name('products.createDraft');
Route::put('/products/drafts' , [ProductController::class, 'updateDraftOnSave'])->name('products.updateDraftOnSave');
Route::patch('/products/{draft}/publish' , [ProductController::class, 'publish'])->name('products.publish');
Route::delete('/products/{product}' , [ProductController::class, 'destroy']) ;





// media section
// store media route
Route::post('/media' , [MediaController::class, 'store'])->name('media.store') ;
// destroy deleted media
Route::delete('/media/{media}', [MediaController::class, 'destroy'])
    ->name('media.destroy');

Route::delete('/media', [MediaController::class, 'destroyBulk'])
    ->name('media.destroy.bulk');
// the end of the media section




// settings 
Route::get("/store" , [StoreConfigController::class ,  'index'])->name("store") ; 
// admin
Route::get('/admins' , [AdminController::class, 'index']) ;

// categories
Route::get('/categories' , [CategoryController::class, 'index']) ;



// variants managment

Route::get('/variants/colors' , [VariantsController::class, 'colors']) ;
Route::get('/variants/sizes' , [VariantsController::class, 'sizes']) ;



// oderes
// OrderManager
Route::get('/orders' , [AdminOrderController::class, 'index']) ;



// customer
Route::get('/customers' , [CurstomerController::class, 'index']) ;



// messages

Route::get('/messages' , [MessageController::class, 'index']) ;


// dashboard/sales_analytics
Route::get('dashboard/sales_analytics' , [DashboardController::class, 'salesIndex']) ;
Route::get('dashboard/customers_analytics' , [DashboardController::class, 'customerIndex']) ;
Route::get('dashboard/inventory_analytics' , [DashboardController::class, 'inventoryIndex']) ;

// require __DIR__.'/auth.php';
