<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributesValues extends Model
{
    protected $fillable = [
        'attribute_id',
        'value',
        'meta',
        'sort_order',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

}
