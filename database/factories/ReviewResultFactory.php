<?php

namespace Database\Factories;

use App\Models\AppProfile;
use App\Models\ReviewResult;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReviewResult>
 */
class ReviewResultFactory extends Factory
{
    protected $model = ReviewResult::class;

    public function definition(): array
    {
        return [
            'app_profile_id' => AppProfile::factory(),
            'name' => $this->faker->word(),
            'file_url' => $this->faker->filePath(),
            'date_uploaded' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'status' => 'Pending',
        ];
    }
}
