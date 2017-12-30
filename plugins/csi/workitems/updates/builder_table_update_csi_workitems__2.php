<?php namespace CSI\WorkItems\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateCsiWorkitems2 extends Migration
{
    public function up()
    {
        Schema::table('csi_workitems_', function($table)
        {
            $table->text('imageurl');
        });
    }
    
    public function down()
    {
        Schema::table('csi_workitems_', function($table)
        {
            $table->dropColumn('imageurl');
        });
    }
}
