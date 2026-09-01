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
        Schema::create('topup_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('topup_package_id')->nullable()->constrained('topup_packages')->nullOnDelete();
            $table->string('order_id')->unique()->index();
            $table->integer('amount_idr');
            $table->integer('total_credits');
            $table->string('snap_token')->nullable();
            $table->enum('status', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->string('payment_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topup_transactions');
    }
};
