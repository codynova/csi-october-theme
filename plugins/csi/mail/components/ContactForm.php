<?php namespace CSI\Mail\Components;

use CMS\Classes\ComponentBase;
use Input;
use Mail;

class ContactForm extends ComponentBase
{

    public function componentDetails(){
        return [
            'name' => 'Contact Form',
            'description' => 'Simple contact form'
        ];
    }

    public function onSend(){
        $vars = [
            'name' => Input::get('username'),
            'email' => Input::get('useremail'),
            'phone' => Input::get('userphone'),
            'subject' => Input::get('usersubject'),
            'content' => Input::get('usermessage')
        ];

        Mail::send('csi.mail::mail.message', $vars, function($message) {
            $message->to('admin@centerstageindustries.com', 'CSI Admin');
            $message->subject($subject);
        });
    }

}