<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'minimum_margin')) {
            Schema::table('products', function (Blueprint $table) {
                $table->decimal('minimum_margin', 5, 2)->nullable()->after('cost_price');
            });
        }

        if (! Schema::hasColumn('app_settings', 'default_minimum_product_margin')) {
            Schema::table('app_settings', function (Blueprint $table) {
                $table->decimal('default_minimum_product_margin', 5, 2)->default(20)->after('enabled_payment_methods');
            });
        }

        Schema::table('transaction_items', function (Blueprint $table) {
            if (! Schema::hasColumn('transaction_items', 'product_name_snapshot')) {
                $table->string('product_name_snapshot')->nullable()->after('product_id');
            }

            if (! Schema::hasColumn('transaction_items', 'selling_price_snapshot')) {
                $table->decimal('selling_price_snapshot', 12, 2)->nullable()->after('subtotal');
            }

            if (! Schema::hasColumn('transaction_items', 'cost_price_snapshot')) {
                $table->decimal('cost_price_snapshot', 12, 2)->nullable()->after('selling_price_snapshot');
            }

            if (! Schema::hasColumn('transaction_items', 'subtotal_revenue_snapshot')) {
                $table->decimal('subtotal_revenue_snapshot', 12, 2)->nullable()->after('cost_price_snapshot');
            }

            if (! Schema::hasColumn('transaction_items', 'subtotal_cost_snapshot')) {
                $table->decimal('subtotal_cost_snapshot', 12, 2)->nullable()->after('subtotal_revenue_snapshot');
            }

            if (! Schema::hasColumn('transaction_items', 'gross_profit_snapshot')) {
                $table->decimal('gross_profit_snapshot', 12, 2)->nullable()->after('subtotal_cost_snapshot');
            }

            if (! Schema::hasColumn('transaction_items', 'gross_margin_snapshot')) {
                $table->decimal('gross_margin_snapshot', 8, 2)->nullable()->after('gross_profit_snapshot');
            }
        });

        if (! Schema::hasTable('product_cost_histories')) {
            Schema::create('product_cost_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->cascadeOnDelete();
                $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->decimal('previous_cost_price', 12, 2);
                $table->decimal('new_cost_price', 12, 2);
                $table->string('change_reason')->nullable();
                $table->timestamps();
            });
        }

        DB::table('app_settings')->update([
            'default_minimum_product_margin' => 20,
        ]);

        $productNames = DB::table('products')->pluck('name', 'id');

        DB::table('transaction_items')
            ->orderBy('id')
            ->chunkById(200, function ($items) use ($productNames): void {
                foreach ($items as $item) {
                    $unitPrice = round((float) $item->unit_price, 2);
                    $unitCost = round((float) $item->unit_cost, 2);
                    $subtotalRevenue = round((float) $item->subtotal, 2);
                    $subtotalCost = round($unitCost * (int) $item->quantity, 2);
                    $grossProfit = round($subtotalRevenue - $subtotalCost, 2);
                    $grossMargin = $subtotalRevenue > 0
                        ? round(($grossProfit / $subtotalRevenue) * 100, 2)
                        : 0;

                    DB::table('transaction_items')
                        ->where('id', $item->id)
                        ->update([
                            'product_name_snapshot' => $productNames[$item->product_id] ?? null,
                            'selling_price_snapshot' => $unitPrice,
                            'cost_price_snapshot' => $unitCost,
                            'subtotal_revenue_snapshot' => $subtotalRevenue,
                            'subtotal_cost_snapshot' => $subtotalCost,
                            'gross_profit_snapshot' => $grossProfit,
                            'gross_margin_snapshot' => $grossMargin,
                        ]);
                }
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_cost_histories');

        $transactionItemColumns = array_values(array_filter([
            Schema::hasColumn('transaction_items', 'product_name_snapshot') ? 'product_name_snapshot' : null,
            Schema::hasColumn('transaction_items', 'selling_price_snapshot') ? 'selling_price_snapshot' : null,
            Schema::hasColumn('transaction_items', 'cost_price_snapshot') ? 'cost_price_snapshot' : null,
            Schema::hasColumn('transaction_items', 'subtotal_revenue_snapshot') ? 'subtotal_revenue_snapshot' : null,
            Schema::hasColumn('transaction_items', 'subtotal_cost_snapshot') ? 'subtotal_cost_snapshot' : null,
            Schema::hasColumn('transaction_items', 'gross_profit_snapshot') ? 'gross_profit_snapshot' : null,
            Schema::hasColumn('transaction_items', 'gross_margin_snapshot') ? 'gross_margin_snapshot' : null,
        ]));

        if ($transactionItemColumns !== []) {
            Schema::table('transaction_items', function (Blueprint $table) use ($transactionItemColumns) {
                $table->dropColumn($transactionItemColumns);
            });
        }

        if (Schema::hasColumn('app_settings', 'default_minimum_product_margin')) {
            Schema::table('app_settings', function (Blueprint $table) {
                $table->dropColumn('default_minimum_product_margin');
            });
        }

        if (Schema::hasColumn('products', 'minimum_margin')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('minimum_margin');
            });
        }
    }
};
