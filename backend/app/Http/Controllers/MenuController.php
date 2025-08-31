<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // List all menu items
    public function index()
    {
        $menuItems = MenuItem::all();
        return response()->json(["success" => true, "menu_items" => $menuItems]);
    }

    // Show a specific menu item
    public function show($id)
    {
        $menuItem = MenuItem::find($id);
        if (!$menuItem) {
            return response()->json(["success" => false, "message" => "Menu item not found"], 404);
        }
        return response()->json(["success" => true, "menu_item" => $menuItem]);
    }

    /** Store new menu item */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "description" => "required|string",
            "price" => "required|numeric|min:0",
            "category" => "required|string|max:255",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048",
            "popular" => "nullable|boolean",
            "available" => "nullable|boolean",
            "ingredients" => "nullable|string", // comma-separated string from frontend
            "allergens" => "nullable|string",   // comma-separated string from frontend
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation errors",
                "errors" => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Save image to disk and generate public URL
        if ($request->hasFile("image")) {
            $imagePath = $request->file("image")->store("menu_images", "public");
            $data["image"] = Storage::url($imagePath); // "/storage/menu_images/xxx.jpg"
        }

        // Convert comma-separated strings to JSON arrays
        if (!empty($data["ingredients"])) {
            $data["ingredients"] = json_encode(array_map("trim", explode(",", $data["ingredients"])));
        }
        if (!empty($data["allergens"])) {
            $data["allergens"] = json_encode(array_map("trim", explode(",", $data["allergens"])));
        }

        // Ensure booleans are stored correctly
        $data["popular"] = (bool) ($data["popular"] ?? false);
        $data["available"] = (bool) ($data["available"] ?? true);

        $menuItem = MenuItem::create($data);

        return response()->json([
            "success" => true,
            "message" => "Menu item created successfully",
            "menu_item" => $menuItem,
        ], 201);
    }

    /** Update existing menu item */
    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::find($id);

        if (!$menuItem) {
            return response()->json([
                "success" => false,
                "message" => "Menu item not found",
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|string|max:255",
            "description" => "sometimes|string",
            "price" => "sometimes|numeric|min:0",
            "category" => "sometimes|string|max:255",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048",
            "popular" => "nullable|boolean",
            "available" => "nullable|boolean",
            "ingredients" => "nullable|string",
            "allergens" => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation errors",
                "errors" => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle new image upload (replace old file)
        if ($request->hasFile("image")) {
            // Delete old image if present
            if ($menuItem->image) {
                $oldImagePath = str_replace("/storage/", "", $menuItem->image);
                Storage::disk("public")->delete($oldImagePath);
            }
            $imagePath = $request->file("image")->store("menu_images", "public");
            $data["image"] = Storage::url($imagePath);
        }

        if (!empty($data["ingredients"])) {
            $data["ingredients"] = json_encode(array_map("trim", explode(",", $data["ingredients"])));
        }
        if (!empty($data["allergens"])) {
            $data["allergens"] = json_encode(array_map("trim", explode(",", $data["allergens"])));
        }

        $data["popular"] = (bool) ($data["popular"] ?? $menuItem->popular);
        $data["available"] = (bool) ($data["available"] ?? $menuItem->available);

        $menuItem->update($data);

        return response()->json([
            "success" => true,
            "message" => "Menu item updated successfully",
            "menu_item" => $menuItem,
        ]);
    }

    // Delete a menu item
    public function destroy($id)
    {
        $menuItem = MenuItem::find($id);
        if (!$menuItem) {
            return response()->json(["success" => false, "message" => "Menu item not found"], 404);
        }

        // Remove image from disk
        if ($menuItem->image) {
            Storage::disk("public")->delete(str_replace("/storage/", "", $menuItem->image));
        }

        $menuItem->delete();
        return response()->json(["success" => true, "message" => "Menu item deleted successfully"]);
    }
}
