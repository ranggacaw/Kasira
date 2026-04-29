<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('short_name', 20)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('business_name')->default('Kasira POS');
            $table->string('business_phone')->nullable();
            $table->text('business_address')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('currency', 10)->default('IDR');
            $table->string('timezone')->default('Asia/Jakarta');
            $table->text('receipt_header')->nullable();
            $table->text('receipt_footer')->nullable();
            $table->boolean('show_cashier_on_receipt')->default(true);
            $table->boolean('show_tax_breakdown_on_receipt')->default(true);
            $table->json('enabled_payment_methods')->nullable();
            $table->string('pwa_name')->default('Kasira POS');
            $table->string('pwa_short_name', 50)->default('Kasira');
            $table->string('pwa_theme_color', 20)->default('#0f172a');
            $table->text('pwa_description')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_draft_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->json('cart');
            $table->json('adjustments')->nullable();
            $table->timestamps();
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('color', 20)->default('#0f766e')->after('description');
            $table->unsignedInteger('sort_order')->default(0)->after('color');
            $table->boolean('is_active')->default(true)->after('sort_order');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('unit_id')->nullable()->after('category_id')->constrained()->nullOnDelete();
            $table->boolean('track_stock')->default(true)->after('image_path');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->string('status')->default('completed')->after('total');
            $table->decimal('paid_amount', 12, 2)->nullable()->after('status');
            $table->timestamp('refunded_at')->nullable()->after('paid_at');
        });

        DB::table('units')->insert([
            [
                'name' => 'Piece',
                'short_name' => 'pcs',
                'description' => 'Default sellable unit.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cup',
                'short_name' => 'cup',
                'description' => 'Prepared beverage serving.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('app_settings')->insert([
            'business_name' => 'Kasira POS',
            'currency' => 'IDR',
            'timezone' => 'Asia/Jakarta',
            'enabled_payment_methods' => json_encode([
                'Cash',
                'QRIS',
                'Bank Transfer',
                'Debit Card',
                'Credit Card',
                'E-Wallet',
            ]),
            'pwa_name' => 'Kasira POS',
            'pwa_short_name' => 'Kasira',
            'pwa_theme_color' => '#0f172a',
            'pwa_description' => 'Kasira business operations and POS workspace.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $defaultUnitId = DB::table('units')->where('short_name', 'pcs')->value('id');

        DB::table('products')->whereNull('unit_id')->update([
            'unit_id' => $defaultUnitId,
        ]);
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['status', 'paid_amount', 'refunded_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('unit_id');
            $table->dropColumn('track_stock');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['color', 'sort_order', 'is_active']);
        });

        Schema::dropIfExists('pos_draft_orders');
        Schema::dropIfExists('app_settings');
        Schema::dropIfExists('units');
    }
};
