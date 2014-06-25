<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddUserIdToSensitiveDataTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('sensitive_data', function(Blueprint $table)
		{
			$table->integer('user_id')->unsigned()->nullable()->index();
            $table->foreign('user_id')->references('id')->on('users');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('sensitive_data', function(Blueprint $table)
		{
            $table->dropForeign('sensitive_data_user_id_foreign');
			$table->dropColumn('user_id');
		});
	}

}
