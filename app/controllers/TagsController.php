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
}