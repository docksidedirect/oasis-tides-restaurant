<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // Create a new order
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'delivery_address' => 'required_if:order_type,delivery|string|max:500',
            'payment_method' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $subtotal = 0;

        // Calculate subtotal dynamically from DB prices for each item
        foreach ($request->items as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            if (!$menuItem) {
                return response()->json(['success' => false, 'message' => 'Menu item not found'], 404);
            }
            $subtotal += $menuItem->price * $item['quantity'];
        }

        // Generate unique order number (UUID here as example)
        $orderNumber = strtoupper(Str::uuid());

        // Set tax and delivery fees as per your logic
        $taxAmount = 0; // Calculate tax as needed
        $deliveryFee = ($request->order_type === 'delivery') ? 5.00 : 0;
        $totalAmount = $subtotal + $taxAmount + $deliveryFee;

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => $orderNumber,
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'delivery_fee' => $deliveryFee,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'order_type' => $request->order_type,
            'delivery_address' => $request->delivery_address,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'notes' => $request->notes,
        ]);

        // Save order items with calculated prices
        foreach ($request->items as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $menuItem->price,
                'total_price' => $menuItem->price * $item['quantity'],
                'customizations' => $item['customizations'] ?? null,
                'special_instructions' => $item['special_instructions'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'order_id' => $order->id,
        ], 201);
    }

    // List all orders for user or admin
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            $orders = Order::with('items.menuItem')->orderByDesc('created_at')->get();
        } else {
            $orders = Order::with('items.menuItem')->where('user_id', $user->id)->orderByDesc('created_at')->get();
        }

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    // Show order details by ID
    public function show($id)
    {
        $user = Auth::user();
        $order = Order::with('items.menuItem')->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json(['success' => true, 'order' => $order]);
    }
}
