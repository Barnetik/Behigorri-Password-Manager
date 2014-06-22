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
    Route::get('/', function() {
        return Redirect::to('sensitiveData');
    });
    
    Route::post('/decrypt', 'SensitiveDataController@decrypt');
    
    Route::resource('sensitiveData', 'SensitiveDataController');
    
});


Route::get('login', 'LoginController@showLoginForm');

Route::post('login', 'LoginController@handleLoginForm');
