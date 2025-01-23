<?php

namespace Database\Factories;

use App\Models\AppProfile;
use App\Models\MessageThread;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MessageThread>
 */
class MessageThreadFactory extends Factory
{
    protected $model = MessageThread::class;

    public function definition(): array
    {
        return [
            'app_profile_id' => AppProfile::factory(),
            'remarks' => $this->faker->paragraph(),
            'by' => $this->faker->name(),
            'read_status' => false,
        ];
    }
}
