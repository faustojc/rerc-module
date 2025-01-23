<?php

namespace Database\Factories;

use App\Models\AppMember;
use App\Models\AppProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppMember>
 */
class AppMemberFactory extends Factory
{
    protected $model = AppMember::class;

    public function definition(): array
    {
        return [
            'app_profile_id' => AppProfile::factory(),
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
        ];
    }
}
