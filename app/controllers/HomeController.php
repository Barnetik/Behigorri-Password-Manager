<?php

class HomeController extends BaseController
{
	public function index()
	{
            $this->layout->content = View::make('sensitiveData.index');
	}

}
