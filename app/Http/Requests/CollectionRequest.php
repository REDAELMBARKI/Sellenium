<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CollectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
            return [
                'identifier'    => ['nullable', 'string', 'max:100', 'unique:rule_based_collections,identifier,' . $this->route('collection')],
                'name'          => ['nullable', 'string', 'max:255'],
                'section_type'  => ['nullable', 'string', 'in:deals,category,featured,default'],
                'is_active'     => ['boolean'],
                'order'         => ['integer', 'min:0'],
                
                'rules'         => ['nullable', 'array'],
                'rules.*.id'    => ['nullable', 'string'],
                'rules.*.field' => ['nullable', 'string', 'in:discount,price,stock,category_id,brand_id'],
                'rules.*.operator' => ['nullable', 'string', 'in:=,>=,<=,>,<,like'],
                'rules.*.value' => ['nullable', 'string'],

                'layout_config'               => ['nullable', 'array'],
                'layout_config.displayLimit'  => ['nullable', 'integer', 'min:1', 'max:50'],
                'layout_config.gap'           => ['nullable', 'integer', 'min:0'],
                'layout_config.paddingInline' => ['nullable', 'integer', 'min:0'],

                'card_config'              => ['nullable', 'array'],
                'card_config.aspectRatio'  => ['nullable', 'string', 'regex:/^\d+\/\d+$/'], // e.g., 1/1, 3/4
                'card_config.borderRadius' => ['nullable', 'integer', 'min:0'],
                'card_config.showPrice'    => ['boolean'],
                'card_config.showBadge'    => ['boolean'],
                'card_config.textAlign'    => ['nullable', 'in:left,center,right'],
                'card_config.hoverEffect'  => ['nullable', 'in:none,zoom,fade,lift'],
            ];
        }
}
