<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    // List reservations for current user or all if admin/staff
    public function index()
    {
        $user = Auth::user();

        if ($user->isAdmin() || $user->isStaff()) {
            $reservations = Reservation::with("user")->orderBy("reservation_date")->orderBy("reservation_time")->get();
        } else {
            $reservations = Reservation::where("user_id", $user->id)
                ->orderBy("reservation_date")
                ->orderBy("reservation_time")
                ->get();
        }

        return response()->json([
            "success" => true,
            "reservations" => $reservations,
        ]);
    }

    // Create a new reservation
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "phone" => "required|string|max:20",
            "email" => "nullable|email|max:255",
            "reservation_date" => "required|date|after_or_equal:today",
            "reservation_time" => "required|date_format:H:i",
            "party_size" => "required|integer|min:1",
            "special_requests" => "nullable|string|max:500",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation errors",
                "errors" => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        $reservation = Reservation::create([
            "user_id" => $user->id,
            "name" => $request->name,
            "phone" => $request->phone,
            "email" => $request->email,
            "reservation_date" => $request->reservation_date,
            "reservation_time" => $request->reservation_time,
            "party_size" => $request->party_size,
            "special_requests" => $request->special_requests,
            "status" => "pending",
        ]);

        return response()->json([
            "success" => true,
            "message" => "Reservation created successfully",
            "reservation_id" => $reservation->id,
        ], 201);
    }

    // Show specific reservation details
    public function show($id)
    {
        $user = Auth::user();
        $reservation = Reservation::with("user")->find($id);

        if (!$reservation) {
            return response()->json(["success" => false, "message" => "Reservation not found"], 404);
        }

        if (!$user->isAdmin() && !$user->isStaff() && $reservation->user_id !== $user->id) {
            return response()->json(["success" => false, "message" => "Unauthorized"], 403);
        }

        return response()->json(["success" => true, "reservation" => $reservation]);
    }

    // Update reservation status (for staff/admin)
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "status" => "required|in:pending,confirmed,cancelled,completed",
        ]);

        if ($validator->fails()) {
            return response()->json(["success" => false, "message" => "Validation errors", "errors" => $validator->errors()], 422);
        }

        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(["success" => false, "message" => "Reservation not found"], 404);
        }

        $user = Auth::user();
        if (!$user->isAdmin() && !$user->isStaff()) {
            return response()->json(["success" => false, "message" => "Unauthorized"], 403);
        }

        $reservation->status = $request->status;
        $reservation->save();

        return response()->json(["success" => true, "message" => "Reservation status updated successfully", "reservation" => $reservation]);
    }

    // Delete a reservation (admin only)
    public function destroy($id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(["success" => false, "message" => "Reservation not found"], 404);
        }

        $user = Auth::user();
        if (!$user->isAdmin()) {
            return response()->json(["success" => false, "message" => "Unauthorized"], 403);
        }

        $reservation->delete();
        return response()->json(["success" => true, "message" => "Reservation deleted successfully"]);
    }
}


