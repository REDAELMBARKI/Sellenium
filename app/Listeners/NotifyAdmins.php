<?php

namespace App\Listeners;

use App\Events\OrderConfirmed;
use App\Mail\OrderConfirmedMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class NotifyAdmins
{
    
    public function handle(OrderConfirmed $event): void
    {
        $admins = $this->getRecipients() ;
        Mail::to(config('Mail.from'))
            ->bcc($admins)
            ->queue(new OrderConfirmedMail($event->order));
    }

    public function getRecipients() : array {
         $superAdmin  = User::where("role" , "super")->pluck('email');
         $admins = User::join('user_role','user_role.user_id' , '=' , "users.id")
                   ->where("user_role.should_notify" , true)
                   ->pluck('users.email')
                   ;
         if($admins->isNotEmpty() ){
            return [
                ...$admins->toArray() ,
                ...$superAdmin->toArray()

            ] ;
         }
         return $superAdmin->toArray() ;
                    
    }
}
