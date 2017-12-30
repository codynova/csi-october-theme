<?php namespace CSI\Navigation\Controllers;

use Backend\Classes\Controller;
use BackendMenu;

class Navigation extends Controller
{
    public $implement = [
        'Backend\Behaviors\ListController','Backend\Behaviors\FormController'    ];
    
    public $listConfig = 'config_list.yaml';
    public $formConfig = 'config_form.yaml';

    public function __construct()
    {
        parent::__construct();
        BackendMenu::setContext('CSI.Navigation', 'main-menu-item');
    }
}
