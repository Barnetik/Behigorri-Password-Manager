<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSensitiveDatumTagTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sensitive_datum_tag', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('sensitive_datum_id')->unsigned()->index();
			$table->foreign('sensitive_datum_id')->references('id')->on('sensitive_data')->onDelete('cascade');
			$table->integer('tag_id')->unsigned()->index();
			$table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('sensitive_datum_tag');
	}

}
