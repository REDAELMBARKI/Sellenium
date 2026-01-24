<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attributes extends Model
{
      protected $fillable = [
        'name',
        'slug',
        'type',
        'is_core',
        'sort_order',
    ];
}
