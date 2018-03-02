<?php namespace CSI\Mail;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function registerComponents()
    {
        return [
            'CSI\Mail\Components\ContactForm' => 'contactform',
        ];
    }

    public function registerSettings()
    {
    }
}
