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
            $table->ulid('original_document_id')->nullable();
            $table->string('status')->default('original');
        });

        Schema::table('review_results', function (Blueprint $table) {
            $table->json('reviewed_document_ids')->nullable();
            $table->text('feedback')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('version');
            $table->dropColumn('original_document_id');
            $table->dropColumn('status');
        });

        Schema::table('review_results', function (Blueprint $table) {
            $table->dropColumn('reviewed_document_ids');
            $table->dropColumn('feedback');
        });
    }
};
