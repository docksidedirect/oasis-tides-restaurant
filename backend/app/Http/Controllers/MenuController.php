<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Get all menu items (optionally filtered by category or availability)
    public function index(Request $request)
    {
        $query = MenuItem::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('available', true)) {
            $query->where('is_available', true);
        }

        $menuItems = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'menu_items' => $menuItems,
        ]);
    }

    // Get one menu item by ID
    public function show($id)
    {
        $menuItem = MenuItem::find($id);

        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'menu_item' => $menuItem,
        ]);
    }
}
