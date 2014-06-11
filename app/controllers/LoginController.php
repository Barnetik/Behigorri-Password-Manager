<?php

class LoginController extends BaseController 
{
	public function showLoginForm()
	{
            $this->layout->content = View::make('login.form');
	}

	public function handleLoginForm()
	{
            $credentials = array(
                'username' => Input::get('username'),
                'password' => Input::get('password')
            );
            
            if ($user = Auth::attempt($credentials)) {
                return Redirect::to('');
            }
            
            $this->showLoginForm();
	}
}
