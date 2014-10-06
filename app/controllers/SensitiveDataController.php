<?php

use Symfony\Component\HttpFoundation\File\File as SymfonyFile;

class SensitiveDataController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /sensitivedata
	 *
	 * @return Response
	 */
	public function index($validator = null)
	{
            $term = '';
            if (Input::has('query') && trim(Input::get('query'))) {
                $term = trim(Input::get('query'));
                $sensitiveData = SensitiveDatum::with('User', 'Tags')->where("name", "like", "%" . $term . "%")->get();
            } else {
                $sensitiveData = SensitiveDatum::with('User', 'Tags')->get();
            }

            $tags = Tag::with('SensitiveData')->get();

            $this->layout->query = $term;

            $this->layout->content = View::make('sensitiveData.index')
                ->with([
                    'sensitiveData' => $sensitiveData,
                    'validator' => $validator,
                    'tags' => $tags
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
                'name' => 'required',
            ));


            if ($validator->fails()) {
                return $this->_ajaxError($validator->messages()->all(), 400);
            }

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
            $user = User::where('username', '=', Auth::user()->getAuthIdentifier())->first();
            $datum->user_id = $user->id;

            if (Input::hasFile('qqfile')) {
                $file = Input::file('qqfile');
                if ($file->isValid()) {
                    $datum->file = $file->getClientOriginalName();
                    $datum->file_contents = File::get($file->getPathname());
                    unlink($file->getPathName());
                }
            }

            $datum->save();

            $this->saveTags(Input::get('tags', array()), $datum);

            $savedData = SensitiveDatum::with('User', 'Tags')->find($datum->id);
            return $savedData->toArrayWithSuccess();
	}

        protected function saveTags($tags, SensitiveDatum $datum)
        {
            $currentTags = array();
            foreach ($tags as $tag) {
                $currentTags[] = $this->getTag($tag['name'])->id;
            }

            $datum->tags()->sync($currentTags);
        }

        protected function getTag($name)
        {
            $cleanName = strtolower(trim($name));
            $tag = Tag::where('name', '=', $cleanName)->first();

            if ($tag) {
                return $tag;
            }

            $tag = App::make('Tag');
            $tag->name = $cleanName;
            $tag->slug = Str::slug($tag->name);
            $tag->save();
            return $tag;

        }

        public function download()
        {
            $datum = SensitiveDatum::find(Input::get('id'));

            if (!$datum) {
                throw new \Exception('Data not found');
            }

            $role = $this->getCurrentRole();
            $datum->setRole($role);
            $datum->decrypt(Input::get('password'));

            $tmpFile = tempnam(sys_get_temp_dir(), 'behigorri_');
            file_put_contents($tmpFile, $datum->file_contents);
            $filename = $datum->file;

            App::finish(function($request, $response) use ($tmpFile) {
                unlink($tmpFile);
            });

            return Response::download($tmpFile, $filename);
        }

        public function decrypt()
        {
            $datum = SensitiveDatum::with('tags')->find(Input::get('id'));

            if (!$datum) {
                throw new \Exception('Data not found');
            }

            $role = $this->getCurrentRole();
            $datum->setRole($role);
            try {
                $datum->decrypt(Input::get('password'));
                return $datum;
            } catch (\Exception $e) {
                return $this->_ajaxError($e->getMessage(), 500);
            }
        }

        public function delete()
        {
            $datum = SensitiveDatum::find(Input::get('id'));

            if (!$datum) {
                throw new \Exception('Data not found');
            }

            $role = $this->getCurrentRole();
            $datum->setRole($role);
            $datum->decrypt(Input::get('password'));
            $datum->delete();

            return Response::make('', 204);
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

        protected function _ajaxError($message, $code)
        {
            return Response::json(
                array(
                    'error' => array(
                        'message' => $message
                    )
                ),
                $code
            );
        }

}