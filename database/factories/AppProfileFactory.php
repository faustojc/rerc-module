<?php

namespace Database\Factories;

use App\Models\AppProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppProfile>
 */
class AppProfileFactory extends Factory
{
    protected $model = AppProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->researcher(),
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'research_title' => $this->faker->sentence(6),
            'date_applied' => $this->faker->dateTimeBetween('-1 month'),
            'protocol_code' => null,
            'protocol_date_updated' => null,
            'review_type' => null,
            'proof_of_payment_url' => null,
            'payment_date' => null,
            'payment_details' => null,
        ];
    }
}
