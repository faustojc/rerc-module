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
        Schema::create('reviewer_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('app_profile_id')
                ->constrained('app_profiles', 'id')
                ->cascadeOnDelete();

            $table->text('message');
            $table->string('status')->default('draft');
            $table->text('file_url');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviewer_reports');
    }
};
