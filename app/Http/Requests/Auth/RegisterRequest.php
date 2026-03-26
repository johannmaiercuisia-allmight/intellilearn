<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Anyone can attempt to register (no auth required).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for registration.
     * If any rule fails, Laravel automatically returns a
     * 422 error with specific error messages — you don't
     * have to write any error handling code yourself.
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'   => ['required', 'string', 'min:8', 'confirmed'],
            // 'confirmed' means the request must also include a
            // 'password_confirmation' field that matches 'password'
        ];
    }

    /**
     * Custom error messages (optional — makes errors more user-friendly).
     */
    public function messages(): array
    {
        return [
            'email.unique'      => 'This email is already registered.',
            'password.confirmed' => 'Passwords do not match.',
            'password.min'       => 'Password must be at least 8 characters.',
        ];
    }
}
