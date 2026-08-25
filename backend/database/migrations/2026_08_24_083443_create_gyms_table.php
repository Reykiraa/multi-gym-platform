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
        Schema::create('gyms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mitra_id')->constrained('users')->onDelete('cascade');
            $table->string('name', 255);
            $table->text('location');
            $table->jsonb('facilities');
            $table->integer('credit_price')->default(0);
            $table->timestamps();
            
            $table->index('mitra_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gyms');
    }
};
