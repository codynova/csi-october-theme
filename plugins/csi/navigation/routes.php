<?php

use Csi\Navigation\Models\Navigation;

Route::get('api/navigation', function() {
    $navItems = Navigation::all();
    return $navItems;
});