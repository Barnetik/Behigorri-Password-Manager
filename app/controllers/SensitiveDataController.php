<?php

class SensitiveDataController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /sensitivedata
	 *
	 * @return Response
	 */
	public function index()
	{
            $sensitiveData = SensitiveDatum::all();
            $this->layout->content = View::make('sensitiveData.index')
                ->with([
                    'sensitiveData' => $sensitiveData
                ]);
            $this->layout->with('scripts', ['js/sensitiveData.js']);
	}

	/**
	 * Show the form for creating a new resource.
	 * GET /sensitivedata/create
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /sensitivedata
	 *
	 * @return Response
	 */
	public function store()
	{
            $validator = Validator::make(Input::all(), array(
//                'name' => 'required|unique:sensitiveData',
                'name' => 'required',
                'value' => 'required'
            ));
            
            if ($validator->passes()) {
                
                if (Input::get('id')) {
                    $datum = SensitiveDatum::find(Input::get('id'));
                    if (!$datum) {
                        throw new \Exception('The datum could not be retrieved');
                    }
                } else {
                    $datum = App::make('SensitiveDatum');
                }

                $role = $this->getCurrentRole();
                $datum->fill(Input::all());
                $datum->setRole($role);
                $datum->save();
            } else {
                var_dump($validator->messages());
            }
            
            $this->index();
	}
        
        public function decrypt()
        {
            $datum = SensitiveDatum::find(Input::get('id'));
            $role = $this->getCurrentRole();
            $datum->setRole($role);
            $datum->decrypt(Input::get('password'));
            return $datum->toJSON();
        }
        
        protected function getCurrentRole()
        {
            return Role::find(1);
        }

	/**
	 * Display the specified resource.
	 * GET /sensitivedata/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 * GET /sensitivedata/{id}/edit
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 * PUT /sensitivedata/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /sensitivedata/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}