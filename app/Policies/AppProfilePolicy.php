<?php

namespace App\Policies;

use App\Models\AppProfile;
use App\Models\User;

class AppProfilePolicy
{
    /**
     * Staffs and Chairpersons can view any model.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['staff', 'chairperson']);
    }

    /**
     * Members of AppProfile, Staffs, and Chairpersons can view the model.
     */
    public function view(User $user, AppProfile $appProfile): bool
    {
        return in_array($user->role, ['staff', 'chairperson']) || $user->id == $appProfile->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role == "researcher";
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AppProfile $appProfile): bool
    {
        return ($user->role == 'researcher' && $user->id == $appProfile->user_id)
            || $user->role == 'staff';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AppProfile $appProfile): bool
    {
        return $user->role == 'researcher' && $user->id == $appProfile->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AppProfile $appProfile): bool
    {
        return $user->role == "researcher"
            && $user->id == $appProfile->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AppProfile $appProfile): bool
    {
        return $user->role == "researcher";
    }
}
