<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    // Record a payment (e.g., webhook or frontend confirmation)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'payment_gateway' => 'required|string',
            'transaction_id' => 'required|string|unique:payments,transaction_id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string',
            'payment_method' => 'required|string',
            'paid_at' => 'nullable|date',
            'details' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $payment = Payment::create([
            'order_id' => $request->order_id,
            'payment_gateway' => $request->payment_gateway,
            'transaction_id' => $request->transaction_id,
            'amount' => $request->amount,
            'status' => $request->status,
            'payment_method' => $request->payment_method,
            'paid_at' => $request->paid_at,
            'details' => $request->details ? json_decode($request->details, true) : null,
        ]);

        // Optionally update order payment status here

        return response()->json(['success' => true, 'payment' => $payment]);
    }

    // Retrieve payments for order
    public function index($orderId)
    {
        $payments = Payment::where('order_id', $orderId)->get();
        return response()->json(['success' => true, 'payments' => $payments]);
    }
}
