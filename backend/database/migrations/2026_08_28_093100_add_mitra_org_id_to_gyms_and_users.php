<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Alter the gyms table:
     *  - Add nullable `mitra_org_id` FK → mitras.id (the brand/organization)
     *  - The existing `mitra_id` → users.id (branch manager account) is retained
     *    for backward compatibility with existing data and Sanctum auth flow.
     *
     * This additive approach avoids destroying existing data while introducing
     * the new organizational hierarchy.
     */
    public function up(): void
    {
        Schema::table('gyms', function (Blueprint $table) {
            $table->foreignId('mitra_org_id')
                ->nullable()
                ->after('mitra_id')
                ->constrained('mitras')
                ->nullOnDelete();

            $table->index('mitra_org_id');
        });

        // Also add mitra_org_id to users so branch manager accounts
        // can be linked back to their parent organization.
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('mitra_org_id')
                ->nullable()
                ->after('role')
                ->constrained('mitras')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gyms', function (Blueprint $table) {
            $table->dropForeign(['mitra_org_id']);
            $table->dropIndex(['mitra_org_id']);
            $table->dropColumn('mitra_org_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['mitra_org_id']);
            $table->dropColumn('mitra_org_id');
        });
    }
};
