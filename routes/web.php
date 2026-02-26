<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CurstomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ShippingController;
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
use App\Http\Controllers\StripeWebhookController;
use Termwind\Components\Raw;

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


//payment section
// checkout 
Route::post('/checkout', [OrderController::class, 'checkout'])->name('order.checkout');
// single product by now 
Route::post('/order/buy-now/now', [OrderController::class , 'store'])->name('order.buynow');
//payment section end



// cart
Route::get('/cart', [CartController::class , 'index'])->name('shoppingCart.index');
Route::delete('/cart/{id}', [CartController::class , 'destroy'])->name('cart.destroy');

// checkout steps routes (this fakes the url to make steps work fine)
Route::get('/checkout', [CartController::class, 'index']);
// end fake url 

//shipping
Route::get('/shipping/calculate/{id}' , [ShippingController::class , 'calculate' ])->name('shipping.calculate');
Route::get('/shippings_cities' , [ShippingController::class, 'getCities'])->name('shipping.cities.get') ;


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
Route::get('/products/drafts' , [ProductController::class, 'drafts'])->name('drafts.index') ;
Route::get('/products' , [ProductController::class, 'index'])->name('products') ;
Route::get('/products/create' , [ProductController::class, 'create']) ;
Route::get('/products/{product}/edit' , [ProductController::class, 'edit'])->name('product.edit') ;
Route::get('/products/{product}' , [ProductController::class, 'show']) ;

// drafts
Route::post('/products' , [ProductController::class, 'storeDraft'])->name('products.storeDraft');
Route::patch('/products/{product}/publish' , [ProductController::class, 'publish'])->name('products.publish');
Route::delete('/products/{product}' , [ProductController::class, 'destroy']) ;
Route::put('/products/{product}' , [ProductController::class, 'update'])->name('product.update');

// media section
// store media route
Route::post('/media' , [MediaController::class, 'storeForProduct'])->name('media.store.forProduct') ;
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
// after checkout sucess 
Route::get("orders/{order}/track" , [OrderController::class, 'authTrack'])->middleware('auth')->name('track.auth') ;
Route::get('/track/{token}', [OrderController::class, 'guestTrack'])
    ->where('token', '[0-9a-f-]{36}')->name('track.guest') ;

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
