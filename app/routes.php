<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::group(array('before' => 'auth'), function()
{
    Route::get('/', function()
    {
        return View::make('hello');
    });

    Route::get('user/profile', function()
    {
        // Has Auth Filter
    });
});


Route::get('login', 'LoginController@showLoginForm');

Route::post('login', 'LoginController@handleLoginForm');
