<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("orders", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->string("order_number")->unique();
            $table->decimal("subtotal", 8, 2);
            $table->decimal("tax_amount", 8, 2)->default(0);
            $table->decimal("delivery_fee", 8, 2)->default(0);
            $table->decimal("total_amount", 8, 2);
            $table->enum("status", ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"])->default("pending");
            $table->enum("order_type", ["dine_in", "takeaway", "delivery"]);
            $table->text("delivery_address")->nullable();
            $table->string("payment_method")->nullable();
            $table->enum("payment_status", ["pending", "paid", "refunded"])->default("pending");
            $table->text("notes")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
