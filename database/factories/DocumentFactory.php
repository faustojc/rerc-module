<?php

namespace Database\Factories;

use App\Models\AppProfile;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'app_profile_id' => AppProfile::factory(),
            'review_result_id' => null,
            'file_url' => $this->faker->url(),
        ];
    }
}
