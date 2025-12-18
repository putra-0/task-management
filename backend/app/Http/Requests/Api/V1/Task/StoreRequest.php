<?php

namespace App\Http\Requests\Api\V1\Task;

use App\Traits\HasValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    use HasValidationRules;

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
        return array_merge(
            $this->taskStatus(),
            [
                'title' => ['bail', 'required', 'string', 'max:255'],
                'description' => ['bail', 'sometimes', 'nullable', 'string'],
                'deadline' => ['bail', 'required', 'date_format:Y-m-d H:i:s', 'after:now'],
            ]
        );
    }
}
