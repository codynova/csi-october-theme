<?php namespace CSI\WorkItems\Models;

use Model;

/**
 * Model
 */
class WorkItem extends Model
{
    use \October\Rain\Database\Traits\Validation;
    
    /**
     * @var array Validation rules
     */
    public $rules = [
    ];

    /**
     * @var string The database table used by the model.
     */
    public $table = 'csi_workitems_';
}
