<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // List all users (Admin only)
    public function index()
    {
        $users = User::all();
        return response()->json(["success" => true, "users" => $users]);
    }

    // Show a specific user (Admin only)
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(["success" => false, "message" => "User not found"], 404);
        }
        return response()->json(["success" => true, "user" => $user]);
    }

    // Create a new user (Admin only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|string|email|max:255|unique:users",
            "password" => "required|string|min:8|confirmed",
            "phone" => "nullable|string|max:20",
            "address" => "nullable|string|max:500",
            "role" => "nullable|in:admin,staff,client",
            "is_active" => "boolean",
        ]);

        if ($validator->fails()) {
            return response()->json(["success" => false, "message" => "Validation errors", "errors" => $validator->errors()], 422);
        }

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "phone" => $request->phone,
            "address" => $request->address,
            "role" => $request->role ?? "client",
            "is_active" => $request->is_active ?? true,
        ]);

        return response()->json(["success" => true, "message" => "User created successfully", "user" => $user], 201);
    }

    // Update an existing user (Admin only)
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(["success" => false, "message" => "User not found"], 404);
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required|string|max:255",
            "email" => "sometimes|required|string|email|max:255|unique:users,email," . $id,
            "password" => "nullable|string|min:8|confirmed",
            "phone" => "nullable|string|max:20",
            "address" => "nullable|string|max:500",
            "role" => "sometimes|nullable|in:admin,staff,client",
            "is_active" => "boolean",
        ]);

        if ($validator->fails()) {
            return response()->json(["success" => false, "message" => "Validation errors", "errors" => $validator->errors()], 422);
        }

        $data = $request->all();
        if (isset($data["password"])) {
            $data["password"] = Hash::make($data["password"]);
        }

        $user->update($data);
        return response()->json(["success" => true, "message" => "User updated successfully", "user" => $user]);
    }

    // Delete a user (Admin only)
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(["success" => false, "message" => "User not found"], 404);
        }

        $user->delete();
        return response()->json(["success" => true, "message" => "User deleted successfully"]);
    }
}


