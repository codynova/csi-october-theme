<?php namespace CSI\Navigation\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateCsiNavigation extends Migration
{
    public function up()
    {
        Schema::create('csi_navigation_', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('label');
            $table->string('matchvalue');
            $table->integer('order');
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('csi_navigation_');
    }
}
