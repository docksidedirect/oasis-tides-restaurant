<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminDashboardController;
// use App\Http\Controllers\CartController; // Uncomment if CartController is implementedF

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('menu-items', [MenuController::class, 'index']);
Route::get('menu-items/{id}', [MenuController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('orders', [OrderController::class, 'index']);      // List orders for user/admin
    Route::post('orders', [OrderController::class, 'store']);     // Create new order
    Route::get('orders/{id}', [OrderController::class, 'show']);  // Show specific order details
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('reservations', [ReservationController::class, 'index']);
    Route::post('reservations', [ReservationController::class, 'store']);
    Route::get('reservations/{id}', [ReservationController::class, 'show']);
});


Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);
Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);


// CartController if implemented

Route::middleware('auth:sanctum')->group(function () {
    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('payments/order/{orderId}', [PaymentController::class, 'index']);

    // Example Cart routes if backend cart needed
    // Route::get('cart', ...);
    // Route::post('cart/items', ...);
    // Route::delete('cart/items/{id}', ...);
});
