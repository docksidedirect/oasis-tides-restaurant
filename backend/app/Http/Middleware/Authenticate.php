<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // For API requests, don't redirect, just return null so 401 JSON is returned
        if (!$request->expectsJson()) {
            return route('login');  // This requires a named 'login' route only for web traffic
        }
        return null;
    }
}
