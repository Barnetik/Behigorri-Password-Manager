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

    Route::post('/sensitiveData/decrypt', 'SensitiveDataController@decrypt');
    Route::post('/sensitiveData/delete', 'SensitiveDataController@delete');
    Route::post('/sensitiveData/download', 'SensitiveDataController@download');

    Route::resource('sensitiveData', 'SensitiveDataController');

    Route::get('/logout', 'LogoutController@logout');

});


Route::get('/login', 'LoginController@showLoginForm');

Route::post('/login', 'LoginController@handleLoginForm');
