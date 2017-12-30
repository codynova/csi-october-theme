<?php

use Csi\Workitems\Models\Workitem;

Route::get('api/workitems', function() {
    $workItems = Workitem::all();
    return $workItems;
});