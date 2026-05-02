<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('outlets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable()->unique();
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->string('membership_number')->nullable()->unique();
            $table->string('membership_tier')->nullable();
            $table->decimal('membership_discount_rate', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('plan');
            $table->string('status')->default('active');
            $table->unsignedInteger('outlet_limit');
            $table->unsignedInteger('user_limit');
            $table->string('billing_email')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('auto_renews')->default(true);
            $table->timestamps();
        });

        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('type');
            $table->decimal('value', 12, 2);
            $table->decimal('minimum_spend', 12, 2)->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code')->unique();
            $table->string('type');
            $table->decimal('value', 12, 2);
            $table->decimal('minimum_spend', 12, 2)->default(0);
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cashier_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('opening_balance', 12, 2)->default(0);
            $table->decimal('closing_balance', 12, 2)->nullable();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->string('status')->default('open');
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('outlet_id')->nullable()->after('role_id')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('password');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('outlet_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->after('outlet_id')->constrained()->nullOnDelete();
            $table->string('barcode')->nullable()->unique()->after('sku');
            $table->decimal('cost_price', 12, 2)->default(0)->after('selling_price');
            $table->integer('stock_quantity')->default(0)->after('cost_price');
            $table->integer('minimum_stock')->default(0)->after('stock_quantity');
            $table->string('image_path')->nullable()->after('minimum_stock');
        });

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->integer('quantity');
            $table->integer('balance_after');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('outlet_id')->nullable()->after('cashier_id')->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->after('outlet_id')->constrained()->nullOnDelete();
            $table->foreignId('promotion_id')->nullable()->after('customer_id')->constrained()->nullOnDelete();
            $table->foreignId('voucher_id')->nullable()->after('promotion_id')->constrained()->nullOnDelete();
            $table->foreignId('cashier_shift_id')->nullable()->after('voucher_id')->constrained('cashier_shifts')->nullOnDelete();
        });

        if (! Schema::hasColumn('transaction_items', 'unit_cost')) {
            Schema::table('transaction_items', function (Blueprint $table) {
                $table->decimal('unit_cost', 12, 2)->default(0)->after('unit_price');
            });
        }

        Schema::create('receipt_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->string('channel');
            $table->string('recipient')->nullable();
            $table->string('status');
            $table->timestamp('delivered_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        $now = now();
        $defaultOutletId = DB::table('outlets')->insertGetId([
            'name' => 'Main Outlet',
            'code' => 'MAIN',
            'is_active' => true,
            'is_primary' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('subscriptions')->insert([
            'plan' => 'Starter',
            'status' => 'active',
            'outlet_limit' => 1,
            'user_limit' => 5,
            'starts_at' => $now,
            'auto_renews' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('users')->whereNull('outlet_id')->update([
            'outlet_id' => $defaultOutletId,
        ]);

        DB::table('products')->whereNull('outlet_id')->update([
            'outlet_id' => $defaultOutletId,
        ]);

        DB::table('transactions')->whereNull('outlet_id')->update([
            'outlet_id' => $defaultOutletId,
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_deliveries');

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cashier_shift_id');
            $table->dropConstrainedForeignId('voucher_id');
            $table->dropConstrainedForeignId('promotion_id');
            $table->dropConstrainedForeignId('customer_id');
            $table->dropConstrainedForeignId('outlet_id');
        });

        Schema::dropIfExists('stock_movements');

        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
            $table->dropConstrainedForeignId('outlet_id');
            $table->dropUnique(['barcode']);
            $table->dropColumn(['barcode', 'cost_price', 'stock_quantity', 'minimum_stock', 'image_path']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('outlet_id');
            $table->dropColumn('is_active');
        });

        Schema::dropIfExists('cashier_shifts');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('outlets');
    }
};
