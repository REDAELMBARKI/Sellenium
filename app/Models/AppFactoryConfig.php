<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppFactoryConfig extends Model
{
    use HasFactory;

    protected $fillable = ['config_key', 'description', 'payload', 'is_active'];

    protected $casts = [
        'payload' => 'array',
        'is_active' => 'boolean',
    ];
}
