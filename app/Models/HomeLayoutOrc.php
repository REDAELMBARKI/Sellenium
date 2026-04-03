<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeLayoutOrc extends Model
{
    protected $fillable = ['sortable_id', 'sortable_type'];

    public function sortable()
    {
        return $this->morphTo();
    }
}
