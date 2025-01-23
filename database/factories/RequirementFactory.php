<?php

namespace Database\Factories;

use App\Models\AppProfile;
use App\Models\Requirement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Requirement>
 */
class RequirementFactory extends Factory
{
    protected $model = Requirement::class;

    public function definition(): array
    {
        return [
            'app_profile_id' => AppProfile::factory(),
            'name' => $this->faker->word(),
            'file_url' => $this->faker->filePath(),
            'date_uploaded' => $this->faker->dateTimeBetween('-1 month'),
            'status' => 'Pending',
        ];
    }
}
