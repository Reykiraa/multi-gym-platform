<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the mitras table.
     *
     * The `mitras` table represents gym operator organizations / brands
     * (e.g. PT FTL, Gold's Gym Indonesia). It is separate from the `users`
     * table so that one brand can register multiple gym locations, each with
     * its own dedicated branch manager user account.
     *
     * Relationship map:
     *   mitras (1) ──< gyms  (many branches per brand)
     *   mitras (1) ──< users (many branch manager accounts)
     */
    public function up(): void
    {
        Schema::create('mitras', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('contact_email', 255)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mitras');
    }
};
