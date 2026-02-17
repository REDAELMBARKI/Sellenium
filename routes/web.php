<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CurstomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\StoreConfigController;
use App\Http\Controllers\VariantsController;
use App\Http\Controllers\AttributesController;
use App\Http\Controllers\DriveController;
use App\Http\Controllers\GoogleSheetsController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;

// auth 
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])
    ->name('google.login');
   
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('google.callback');

Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');


Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');    
    
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::get('/register', [RegisteredUserController::class, 'create'])
    ->name('register');
    
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->name('register.store');


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

Route::get('/cart', [CartController::class , 'index'])->name('shoppingCart.index');




// routes/web.php or api.php
Route::get('/sheetAuth/google/callback', [DriveController::class, 'callBack']);
Route::get('/sheetAuth/google/auth', [DriveController::class, 'auth']);
Route::post('/sheets', [DriveController::class, 'auth'])
->name('googleSheet.create');


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
Route::get('/products/drafts' , [ProductController::class, 'draft'])->name('drafts.index') ;
Route::get('/products/{product}/edit' , [ProductController::class, 'edit'])->name('product.edit') ;
Route::get('/products' , [ProductController::class, 'index'])->name('products') ;
Route::get('/products/show' , [ProductController::class, 'show']) ;
Route::post('/products' , [ProductController::class, 'createDraft'])->name('products.createDraft');
Route::put('/products/drafts' , [ProductController::class, 'updateDraftOnSave'])->name('products.updateDraftOnSave');
Route::patch('/products/{draft}/publish' , [ProductController::class, 'publish'])->name('products.publish');
Route::delete('/products/{product}' , [ProductController::class, 'destroy']) ;
Route::put('/products/{product}' , [ProductController::class, 'update'])->name('product.update');


// media section
// store media route
Route::post('/media' , [MediaController::class, 'store'])->name('media.store') ;
// destroy deleted media
Route::delete('/media/{media}', [MediaController::class, 'destroy'])
    ->name('media.destroy');

Route::delete('/media', [MediaController::class, 'destroyBulk'])
    ->name('media.destroy.bulk');
// the end of the media section


// catgeories secion
// Route::get('/categories' , [CategoryController::class, 'index']) ;
Route::get('/subcatgeories' , [CategoryController::class, 'subCategories'])->name('get.subCategories');
//end categories section



// attributes
Route::get('/attributes' , [AttributesController::class, 'index'])->name('get.attributes');
Route::post('/attributes' , [AttributesController::class, 'store'])->name('store.attributes');



// settings 
Route::get("/store" , [StoreConfigController::class ,  'index'])->name("store") ; 
// admin
Route::get('/admins' , [AdminController::class, 'index']) ;

// categories



// variants managment

Route::get('/variants/colors' , [VariantsController::class, 'colors']) ;
Route::get('/variants/sizes' , [VariantsController::class, 'sizes']) ;



// oderes
// OrderManager
Route::get('/orders' , [OrderController::class, 'index'])->middleware('auth')->name('orders.index') ;
Route::post('/checkout', [OrderController::class, 'checkout'])->name('order.checkout');
Route::get("/checkout/success" , [OrderController::class, 'checkoutSuccess'])->name('checkout.success') ;

// coupon aplly ajaxrequest
Route::post('/coupon_feedback', [CouponController::class,'coupon_feedback'])->name('coupon.feedback');
// customer
Route::get('/customers' , [CurstomerController::class, 'index']) ;



// messages

Route::get('/messages' , [MessageController::class, 'index']) ;


// dashboard/sales_analytics
Route::get('dashboard/sales_analytics' , [DashboardController::class, 'salesIndex']) ;
Route::get('dashboard/customers_analytics' , [DashboardController::class, 'customerIndex']) ;
Route::get('dashboard/inventory_analytics' , [DashboardController::class, 'inventoryIndex']) ;

// require __DIR__.'/auth.php';
