<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddFileFieldsToSensitiveDataTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::table('sensitive_data', function(Blueprint $table)
            {
                $table->string('file');
                $table->longText('file_contents');
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
                    $table->dropColumn('file_contents');
                    $table->dropColumn('file');
		});
	}

}
