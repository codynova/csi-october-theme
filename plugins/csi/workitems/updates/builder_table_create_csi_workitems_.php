<?php namespace CSI\WorkItems\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateCsiWorkitems extends Migration
{
    public function up()
    {
        Schema::create('csi_workitems_', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('title');
            $table->text('description');
            $table->string('pageurl');
            $table->text('filtertags');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('csi_workitems_');
    }
}
