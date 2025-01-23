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
        Schema::create('requirements', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('app_profile_id')
                ->constrained('app_profiles', 'id')
                ->cascadeOnDelete();

            $table->string('name');
            $table->text('file_url');

            $table->dateTime('date_uploaded');

            $table->string('status')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requirements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('app_profile_id');
        });
        Schema::dropIfExists('requirements');
    }
};
