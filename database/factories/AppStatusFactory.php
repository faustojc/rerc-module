<?php

namespace Database\Factories;

use App\Models\AppProfile;
use App\Models\AppStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppStatus>
 */
class AppStatusFactory extends Factory
{
    protected $model = AppStatus::class;

    public function definition(): array
    {
        return [
            'app_profile_id' => AppProfile::factory(),
            'name' => $this->faker->randomElement([
                'Inquiry Submitted',
                'Requirements Checking',
                'Under Initial Review',
            ]),
            'sequence' => $this->faker->numberBetween(1, 7),
            'status' => 'Pending',
            'start' => $this->faker->dateTimeBetween('-1 month'),
            'end' => null,
        ];
    }
}
