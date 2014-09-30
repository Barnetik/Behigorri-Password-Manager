<?php

class TagsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /tags
	 *
	 * @return Response
	 */
	public function index()
	{
            $tags = Tag::all();
            return Response::json($tags);
	}

        /**
	 * Display a listing of the resource.
	 * GET /tags/search
	 *
	 * @return Response
	 */
	public function search()
	{
            $tags = Tag::where('name', 'LIKE', Input::get('query') . '%')->get();
            return Response::json($tags);
	}
}