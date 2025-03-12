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
        Schema::table('ethics_clearances', function (Blueprint $table) {
            $table->dateTime('effective_start_date')->nullable();
            $table->dateTime('effective_end_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ethics_clearances', function (Blueprint $table) {
            $table->dropColumn(['effective_start_date', 'effective_end_date']);
        });
    }
};
