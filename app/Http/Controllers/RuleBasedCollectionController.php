<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RuleBasedCollectionController extends Controller
{
    public function create()
    {
        $fields = [
            ['name' => 'title', 'label' => 'Title', 'type' => 'text', 'required' => true],
            ['name' => 'slug', 'label' => 'Slug', 'type' => 'text', 'required' => true],
            ['name' => 'parent_id', 'label' => 'Parent', 'type' => 'select', 'options' => [], 'nullable' => true],
            ['name' => 'description', 'label' => 'Description', 'type' => 'textarea', 'required' => false],
            ['name' => 'is_active', 'label' => 'Active', 'type' => 'boolean', 'default' => true],
        ];

        $operators = [
            ['value' => 'equals', 'label' => 'Equals'],
            ['value' => 'not_equals', 'label' => 'Not equals'],
            ['value' => 'contains', 'label' => 'Contains'],
            ['value' => 'starts_with', 'label' => 'Starts with'],
            ['value' => 'ends_with', 'label' => 'Ends with'],
            ['value' => 'gt', 'label' => 'Greater than'],
            ['value' => 'lt', 'label' => 'Less than'],
        ];

        return \Inertia\Inertia::render('admin/pages/store/RuleBasedCollections/CollectionEditor', [
            'fields' => $fields,
            'operators' => $operators,
        ]);
    }

   
}
