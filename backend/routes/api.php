<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public menu routes
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{id}', [MenuController::class, 'show']);
Route::get('/menu/category/{category}', [MenuController::class, 'getByCategory']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated user actions
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Unified dashboard route with role-based response
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return app(DashboardController::class)->adminDashboard($request);
        } elseif ($user->hasRole('staff')) {
            return app(DashboardController::class)->staffDashboard($request);
        } else {
            return response()->json(['message' => 'Client dashboard data placeholder'], 200);
        }
    });

    // Reservations CRUD
    Route::apiResource('reservations', ReservationController::class);

    // Orders CRUD
    Route::apiResource('orders', OrderController::class);

    // Dashboard stats
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        // Menu management
        Route::post('/menu', [MenuController::class, 'store']);
        Route::put('/menu/{id}', [MenuController::class, 'update']);
        Route::delete('/menu/{id}', [MenuController::class, 'destroy']);

        // Admin dashboard & management
        Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);
        Route::get('/admin/users', [DashboardController::class, 'getUsers']);
        Route::get('/admin/reservations', [ReservationController::class, 'adminIndex']);
        Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
    });

    /*
    |--------------------------------------------------------------------------
    | Staff & Admin Shared Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,staff')->group(function () {
        Route::get('/staff/dashboard', [DashboardController::class, 'staffDashboard']);
        Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });
});

/*
|--------------------------------------------------------------------------
| CORS Preflight Support for All Routes
|--------------------------------------------------------------------------
*/
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');
