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
        Schema::create('app_profiles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')
                ->constrained('users', 'id')
                ->cascadeOnDelete();

            $table->string('firstname');
            $table->string('lastname');

            $table->string('research_title');

            $table->dateTime('date_applied');

            $table->string('protocol_code')->nullable();
            $table->dateTime('protocol_date_updated')->nullable();

            $table->string('review_type')->nullable();

            $table->text('proof_of_payment_url')->nullable();
            $table->dateTime('payment_date')->nullable();
            $table->text('payment_details')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('app_profiles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });
        Schema::dropIfExists('app_profiles');
    }
};
