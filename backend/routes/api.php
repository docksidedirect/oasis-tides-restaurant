<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);
Route::get("/menu", [MenuController::class, "index"]);
Route::get("/menu/{id}", [MenuController::class, "show"]);
Route::get("/blog/posts", [BlogController::class, "index"]);
Route::get("/blog/posts/{slug}", [BlogController::class, "show"]);

// Authenticated routes
Route::middleware("auth:sanctum")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get("/user", [AuthController::class, "me"]);

    // Dashboard routes
    Route::get("/dashboard", [DashboardController::class, "index"]);

    // Order routes
    Route::post("/orders", [OrderController::class, "store"]);
    Route::get("/orders/my-orders", [OrderController::class, "index"]);
    Route::get("/orders/{id}", [OrderController::class, "show"]);

    // Reservation routes
    Route::post("/reservations", [ReservationController::class, "store"]);
    Route::get("/reservations", [ReservationController::class, "index"]);
    Route::get("/reservations/{id}", [ReservationController::class, "show"]);

    // Admin and Staff routes
    Route::middleware(["role:admin,staff"])->group(function () {
        // Order management
        Route::get("/orders", [OrderController::class, "adminIndex"]);
        Route::put("/orders/{id}/status", [OrderController::class, "updateStatus"]);
        // Reservation status update
        Route::put("/reservations/{id}/status", [ReservationController::class, "updateStatus"]);
    });

    // Admin routes
    Route::middleware(["role:admin"])->group(function () {
        // Menu management
        Route::post("/menu", [MenuController::class, "store"]);
        Route::put("/menu/{id}", [MenuController::class, "update"]);
        Route::delete("/menu/{id}", [MenuController::class, "destroy"]);

        // Blog management
        Route::post("/blog/posts", [BlogController::class, "store"]);
        Route::put("/blog/posts/{id}", [BlogController::class, "update"]);
        Route::delete("/blog/posts/{id}", [BlogController::class, "destroy"]);

        // User management
        Route::get("/users", [UserController::class, "index"]);
        Route::post("/users", [UserController::class, "store"]);
        Route::get("/users/{id}", [UserController::class, "show"]);
        Route::put("/users/{id}", [UserController::class, "update"]);
        Route::delete("/users/{id}", [UserController::class, "destroy"]);
        Route::delete("/orders/{id}", [OrderController::class, "destroy"]);
        Route::delete("/reservations/{id}", [ReservationController::class, "destroy"]);
    });
});
