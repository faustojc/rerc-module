<?php

use App\Models\AppProfile;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int)$user->id === (int)$id;
});

Broadcast::channel('application-list', function ($user) {
    return $user->role !== 'researcher';
});

Broadcast::channel('application.{id}', function ($user, $id) {
    $application = AppProfile::find($id);

    if (!$application) {
        return FALSE;
    }

    return $user->id === $application->user_id || in_array($user->role, ['staff', 'chairperson']);
});
