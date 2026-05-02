<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('unit_cost', 12, 2)->nullable();
            $table->decimal('subtotal', 12, 2);
            $table->decimal('selling_price_snapshot', 12, 2)->nullable();
            $table->decimal('cost_price_snapshot', 12, 2)->nullable();
            $table->decimal('subtotal_revenue_snapshot', 12, 2)->nullable();
            $table->decimal('subtotal_cost_snapshot', 12, 2)->nullable();
            $table->decimal('gross_profit_snapshot', 12, 2)->nullable();
            $table->decimal('gross_margin_snapshot', 5, 2)->nullable();
            $table->string('product_name_snapshot')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};