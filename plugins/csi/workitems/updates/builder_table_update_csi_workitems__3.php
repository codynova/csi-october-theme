<?php namespace CSI\WorkItems\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateCsiWorkitems3 extends Migration
{
    public function up()
    {
        Schema::table('csi_workitems_', function($table)
        {
            $table->integer('order');
        });
    }
    
    public function down()
    {
        Schema::table('csi_workitems_', function($table)
        {
            $table->dropColumn('order');
        });
    }
}
