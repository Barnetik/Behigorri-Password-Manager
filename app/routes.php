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
    Route::get('/', 'HomeController@index');
    Route::get('/sensitiveData/list', 'SensitiveDataController@getList');

    Route::post('/sensitiveData/decrypt', 'SensitiveDataController@decrypt');
    Route::post('/sensitiveData/delete', 'SensitiveDataController@delete');
    Route::post('/sensitiveData/download', 'SensitiveDataController@download');

    Route::resource('sensitiveData', 'SensitiveDataController');
    Route::post('sensitiveData', ['as' => 'sensitiveData', 'uses' => 'SensitiveDataController@store']);

    Route::get('/logout', 'LogoutController@logout');
    Route::get('/tags', 'TagsController@index');
    Route::get('/tags/search', 'TagsController@search');
    Route::get('/tags/name/:name', 'SensitiveDataController@byTag');
});


Route::get('/login', 'LoginController@showLoginForm');

Route::post('/login', 'LoginController@handleLoginForm');
