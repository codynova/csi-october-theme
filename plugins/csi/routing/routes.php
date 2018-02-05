<?php

Route::get('/about', function() {
    return redirect('/');
});

Route::get('/contact', function() {
    return redirect('/');
});

Route::get('/work/{value}', function($value) {
    return redirect('/');
});