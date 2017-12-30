<?php

use Csi\Workitems\Models\Workitem;
use Csi\Navigation\Models\Navigation;

Route::get('api/workitems', function() {
    $workItems = Workitem::all();
    return $workItems;
});

Route::get('api/navigation', function() {
    $navItems = Navigation::all();
    return $navItems;
});