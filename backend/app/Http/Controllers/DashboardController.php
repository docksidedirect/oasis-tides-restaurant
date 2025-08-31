<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Reservation;
use App\Models\MenuItem;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        } elseif ($user->isStaff()) {
            return $this->staffDashboard();
        } elseif ($user->isClient()) {
            return $this->clientDashboard();
        } else {
            return response()->json(["success" => false, "message" => "Unauthorized role"], 403);
        }
    }

    private function adminDashboard()
    {
        $totalOrders = Order::count();
        $pendingReservations = Reservation::where("status", "pending")->count();
        $totalRevenue = Order::where("payment_status", "paid")->sum("total_amount");
        $todayOrders = Order::whereDate("created_at", today())->count();
        $recentOrders = Order::with("user")->orderByDesc("created_at")->limit(5)->get();
        $popularItems = MenuItem::where("popular", true)->get();
        $totalBlogPosts = BlogPost::count();

        return response()->json([
            "success" => true,
            "dashboard" => "admin",
            "stats" => [
                "total_orders" => $totalOrders,
                "pending_reservations" => $pendingReservations,
                "total_revenue" => $totalRevenue,
                "today_orders" => $todayOrders,
                "total_blog_posts" => $totalBlogPosts,
            ],
            "recent_orders" => $recentOrders,
            "popular_items" => $popularItems,
        ]);
    }

    private function staffDashboard()
    {
        $pendingOrders = Order::whereIn("status", ["pending", "confirmed", "preparing"])->count();
        $todayReservations = Reservation::whereDate("reservation_date", today())->count();
        $newOrders = Order::where("status", "pending")->orderByDesc("created_at")->limit(5)->get();
        $upcomingReservations = Reservation::where("status", "confirmed")
            ->where("reservation_date", ">=", today())
            ->orderBy("reservation_date")
            ->orderBy("reservation_time")
            ->limit(5)
            ->get();

        return response()->json([
            "success" => true,
            "dashboard" => "staff",
            "stats" => [
                "pending_orders" => $pendingOrders,
                "today_reservations" => $todayReservations,
            ],
            "new_orders" => $newOrders,
            "upcoming_reservations" => $upcomingReservations,
        ]);
    }

    private function clientDashboard()
    {
        $user = Auth::user();
        $upcomingReservations = Reservation::where("user_id", $user->id)
            ->where("reservation_date", ">=", today())
            ->orderBy("reservation_date")
            ->orderBy("reservation_time")
            ->get();

        $recentOrders = Order::where("user_id", $user->id)
            ->orderByDesc("created_at")
            ->limit(5)
            ->get();

        return response()->json([
            "success" => true,
            "dashboard" => "client",
            "upcoming_reservations" => $upcomingReservations,
            "recent_orders" => $recentOrders,
        ]);
    }
}


