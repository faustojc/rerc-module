<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class GenerateHelper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-helper';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run all IDE helper commands in sequence';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        // Run ide-helper:generate
        $this->info("Running ide-helper:generate...");
        Artisan::call('ide-helper:generate');
        $this->line(Artisan::output());

        // Run ide-helper:meta
        $this->info("Running ide-helper:meta...");
        Artisan::call('ide-helper:meta');
        $this->line(Artisan::output());

        // Run ide-helper:models
        $this->info("Running ide-helper:models... Overwrite the existing model files? Choose no to write to _ide_helper_models.php instead (yes/no)");
        Artisan::call('ide-helper:models');
        $this->line(Artisan::output());

        // Run ide-helper:eloquent
        $this->info("Running ide-helper:eloquent...");
        Artisan::call('ide-helper:eloquent');
        $this->line(Artisan::output());

        $this->info('All IDE helper commands have been executed.');
    }
}
