<?php

namespace Database\Seeders;

use App\Models\AppMember;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\Document;
use App\Models\MessageThread;
use App\Models\Requirement;
use App\Models\User;
use Illuminate\Database\Seeder;

class CurrentUserSeeder extends Seeder
{
    public function run(): void
    {
        // Disable mass assignment protection
        User::unguard();
        AppProfile::unguard();
        AppStatus::unguard();
        AppMember::unguard();
        Requirement::unguard();
        Document::unguard();
        MessageThread::unguard();

        // Create the specified user
        $user = User::query()->where('id', '=', '01jh2knefp821ysjk5advdx5ex')->first(['id', 'name']);

        // Create 2 AppProfiles for the user
        for ($i = 0; $i < 2; $i++) {
            $appProfile = AppProfile::create([
                'user_id' => $user->id,
                'firstname' => $user->name,
                'lastname' => 'Test',
                'research_title' => 'Research Title Test ' . ($i + 1),
                'date_applied' => now()->subDays(rand(1, 30)),
            ]);

            // Create 4 AppMembers
            AppMember::factory()
                ->count(4)
                ->state(['app_profile_id' => $appProfile->id])
                ->create();

            // Create 3 to 5 AppStatuses in order
            $statusNames = [
                'Inquiry Submitted',
                'Requirements Checking',
                'Requirements Complete',
                'Under Initial Review',
                'Review Completed',
            ];

            $statusesCount = rand(3, 5);
            for ($sequence = 1; $sequence <= $statusesCount; $sequence++) {
                AppStatus::create([
                    'app_profile_id' => $appProfile->id,
                    'name' => $statusNames[$sequence - 1],
                    'sequence' => $sequence,
                    'status' => $sequence < $statusesCount ? 'Completed' : 'Pending',
                    'start' => now()->subDays(rand(1, 30))->addDays($sequence),
                    'end' => $sequence < $statusesCount ? now()->subDays(rand(1, 30))->addDays($sequence + 1) : null,
                ]);
            }

            // Create 2 to 4 Requirements
            Requirement::factory()
                ->count(rand(2, 4))
                ->state(['app_profile_id' => $appProfile->id])
                ->create();

            // Create 2 to 4 Documents
            Document::factory()
                ->count(rand(2, 4))
                ->state(['app_profile_id' => $appProfile->id])
                ->create();

            // Create 5 to 8 MessageThreads
            MessageThread::factory()
                ->count(rand(5, 8))
                ->state(['app_profile_id' => $appProfile->id])
                ->create();
        }

        // Re-enable mass assignment protection
        User::reguard();
        AppProfile::reguard();
        AppStatus::reguard();
        AppMember::reguard();
        Requirement::reguard();
        Document::reguard();
        MessageThread::reguard();

        $this->command->info('Current user data seeded successfully.');
    }
}
