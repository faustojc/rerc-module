<?php

namespace Database\Seeders;

use App\Models\AppMember;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\Requirement;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResearcherSeeder extends Seeder
{
    public function run(): void
    {
        // Disable mass assignment protection
        User::unguard();
        AppProfile::unguard();
        AppStatus::unguard();
        AppMember::unguard();
        Requirement::unguard();

        // Create Researchers
        User::factory()
            ->count(5)
            ->researcher()
            ->has(
                AppProfile::factory()
                    ->has(
                        Requirement::factory()->count(3),
                        'requirements'
                    )
                    ->has(
                        AppStatus::factory()->state(function (array $attributes, AppProfile $profile) {
                            return [
                                'app_profile_id' => $profile->id,
                                'sequence' => 1,
                                'name' => 'Inquiry Submitted',
                                'status' => 'Completed',
                                'start' => $profile->date_applied,
                                'end' => now(),
                            ];
                        })->count(1),
                        'statuses'
                    )
                    ->has(
                        AppMember::factory()->count(3),
                        'members'
                    )
                    ->count(1),
                'appProfiles'
            )
            ->create();

        // Re-enable mass assignment protection
        User::reguard();
        AppProfile::reguard();
        AppStatus::reguard();
        AppMember::reguard();
        Requirement::reguard();

        $this->command->info('Researcher data seeded successfully.');
    }
}
