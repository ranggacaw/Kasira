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
        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('business_name')->nullable();
            $table->string('business_phone')->nullable();
            $table->text('business_address')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('currency')->default('IDR');
            $table->string('timezone')->default('Asia/Jakarta');
            $table->text('receipt_header')->nullable();
            $table->text('receipt_footer')->nullable();
            $table->boolean('show_cashier_on_receipt')->default(true);
            $table->boolean('show_tax_breakdown_on_receipt')->default(false);
            $table->json('enabled_payment_methods')->nullable();
            $table->string('pwa_name')->nullable();
            $table->string('pwa_short_name')->nullable();
            $table->string('pwa_theme_color')->nullable();
            $table->string('pwa_description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
