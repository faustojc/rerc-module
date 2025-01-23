<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('app_profile_id')
                ->constrained('app_profiles', 'id')
                ->cascadeOnDelete();
            $table->foreignUlid('review_result_id')
                ->nullable()
                ->constrained('review_results', 'id')
                ->nullOnDelete();

            $table->text('file_url');
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('app_profile_id');
            $table->dropConstrainedForeignId('review_result_id');
        });
        Schema::dropIfExists('documents');
    }
};
