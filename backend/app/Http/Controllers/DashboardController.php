<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Reservation;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return $this->adminDashboard();
        } elseif ($user->role === 'staff') {
            return $this->staffDashboard();
        } elseif ($user->role === 'client') {
            return $this->clientDashboard();
        } else {
            return response()->json(['success' => false, 'message' => 'Unauthorized role'], 403);
        }
    }

    private function adminDashboard()
    {
        $totalOrders = Order::count();
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $featuredMenuItems = MenuItem::where('is_featured', true)->get();

        return response()->json([
            'success' => true,
            'dashboard' => 'admin',
            'total_orders' => $totalOrders,
            'pending_reservations' => $pendingReservations,
            'featured_menu_items' => $featuredMenuItems,
        ]);
    }

    private function staffDashboard()
    {
        $pendingOrders = Order::whereIn('status', ['pending', 'confirmed', 'preparing'])->count();
        $todayReservations = Reservation::whereDate('reservation_date', today())->count();

        return response()->json([
            'success' => true,
            'dashboard' => 'staff',
            'pending_orders' => $pendingOrders,
            'today_reservations' => $todayReservations,
        ]);
    }

    private function clientDashboard()
    {
        $user = Auth::user();
        $upcomingReservations = Reservation::where('user_id', $user->id)
            ->where('reservation_date', '>=', today())
            ->orderBy('reservation_date')
            ->get();

        $recentOrders = Order::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'dashboard' => 'client',
            'upcoming_reservations' => $upcomingReservations,
            'recent_orders' => $recentOrders,
        ]);
    }
}
