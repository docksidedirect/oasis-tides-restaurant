<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where(\'email\', \'admin@oasistides.com\')->first();

if ($user) {
    $user->password = Hash::make(\'password\');
    $user->save();
    echo \'Admin password reset successfully.\';
} else {
    echo \'Admin user not found.\';
}

?>

