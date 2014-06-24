<?php

class LogoutController extends BaseController 
{
	public function logout()
	{
            Auth::logout();
            return Redirect::to('/');
	}
}
