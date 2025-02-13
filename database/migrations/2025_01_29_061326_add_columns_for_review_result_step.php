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
        Schema::table('documents', function (Blueprint $table) {
            $table->unsignedInteger('version')->default(1);
            $table->string('status')->default('Original');
        });

        Schema::table('review_results', function (Blueprint $table) {
            $table->unsignedInteger('version')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('version');
            $table->dropColumn('status');
        });

        Schema::table('review_results', function (Blueprint $table) {
            $table->dropColumn('version');
        });
    }
};
