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
        Schema::create('decision_letters', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('app_profile_id')
                ->constrained('app_profiles', 'id')
                ->cascadeOnDelete();

            $table->string('file_name');
            $table->text('file_path');
            $table->boolean('is_signed')->default(FALSE);
            $table->dateTime('date_uploaded');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('decision_letters', function (Blueprint $table) {
            $table->dropConstrainedForeignId('app_profile_id');
        });
        Schema::dropIfExists('decision_letters');
    }
};
