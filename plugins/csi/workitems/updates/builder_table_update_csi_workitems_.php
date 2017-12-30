<?php namespace CSI\WorkItems\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateCsiWorkitems extends Migration
{
    public function up()
    {
        Schema::table('csi_workitems_', function($table)
        {
            $table->string('subtitle');
            $table->increments('id')->unsigned(false)->change();
        });
    }
    
    public function down()
    {
        Schema::table('csi_workitems_', function($table)
        {
            $table->dropColumn('subtitle');
            $table->increments('id')->unsigned()->change();
        });
    }
}
