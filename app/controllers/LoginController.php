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
                'username' => trim(Input::get('username')),
                'password' => Input::get('password')
            );
            
            if (Auth::attempt($credentials)) {
                $this->createUserIfNotExists($credentials['username']);
                return Redirect::to('');
            }
            
            $this->showLoginForm();
	}
        
        public function createUserIfNotExists($username)
        {
            $user = User::where('username', '=', $username)->first();
            if (!$user) {
                $user = App::make('User');
                $user->username = $username;
                $user->save();
            }
            return $user;
        }
}
