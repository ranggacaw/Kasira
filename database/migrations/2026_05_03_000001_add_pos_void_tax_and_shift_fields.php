<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('transactions', 'cancelled_at')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->timestamp('cancelled_at')->nullable()->after('refunded_at');
            });
        }

        if (! Schema::hasColumn('app_settings', 'default_checkout_tax_rate')) {
            Schema::table('app_settings', function (Blueprint $table) {
                $table->decimal('default_checkout_tax_rate', 5, 2)->default(0)->after('default_minimum_product_margin');
            });
        }

        Schema::table('cashier_shifts', function (Blueprint $table) {
            if (! Schema::hasColumn('cashier_shifts', 'expected_cash')) {
                $table->decimal('expected_cash', 12, 2)->nullable()->after('closing_balance');
            }

            if (! Schema::hasColumn('cashier_shifts', 'cash_difference')) {
                $table->decimal('cash_difference', 12, 2)->nullable()->after('expected_cash');
            }

            if (! Schema::hasColumn('cashier_shifts', 'sales_summary')) {
                $table->json('sales_summary')->nullable()->after('cash_difference');
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('transactions', 'cancelled_at')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropColumn('cancelled_at');
            });
        }

        if (Schema::hasColumn('app_settings', 'default_checkout_tax_rate')) {
            Schema::table('app_settings', function (Blueprint $table) {
                $table->dropColumn('default_checkout_tax_rate');
            });
        }

        $cashierShiftColumns = array_values(array_filter([
            Schema::hasColumn('cashier_shifts', 'expected_cash') ? 'expected_cash' : null,
            Schema::hasColumn('cashier_shifts', 'cash_difference') ? 'cash_difference' : null,
            Schema::hasColumn('cashier_shifts', 'sales_summary') ? 'sales_summary' : null,
        ]));

        if ($cashierShiftColumns !== []) {
            Schema::table('cashier_shifts', function (Blueprint $table) use ($cashierShiftColumns) {
                $table->dropColumn($cashierShiftColumns);
            });
        }
    }
};
