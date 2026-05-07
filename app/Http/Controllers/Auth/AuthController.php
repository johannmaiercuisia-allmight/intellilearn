<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * REGISTER A NEW USER
     *
     * POST /api/register
     * Body: { first_name, last_name, email, password, password_confirmation }
     *
     * What happens:
     * 1. RegisterRequest validates all fields automatically
     * 2. User is created in the database (password is auto-hashed)
     * 3. Email verification is triggered
     * 4. A Sanctum token is generated for immediate login
     * 5. User data + token are returned
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'first_name'        => $request->first_name,
            'last_name'         => $request->last_name,
            'email'             => $request->email,
            'password'          => $request->password,
            'role'              => 'student',
            'email_verified_at' => now(), // Auto-verify for live demo
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'role'       => $user->role,
                'full_name'  => $user->full_name,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * LOG IN AN EXISTING USER
     *
     * POST /api/login
     * Body: { email, password }
     *
     * What happens:
     * 1. LoginRequest validates email and password are present
     * 2. We check if the credentials match a user in the database
     * 3. We check if the account is active (not deactivated by admin)
     * 4. Update last_login_at timestamp
     * 5. Generate a token and return user data
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists AND password matches
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if account is active
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact the administrator.'],
            ]);
        }

        // Update last login timestamp — feeds into predictive analytics
        $user->update(['last_login_at' => now()]);

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'role'       => $user->role,
                'full_name'  => $user->full_name,
            ],
            'token' => $token,
        ]);
    }

    /**
     * LOG OUT THE CURRENT USER
     *
     * POST /api/logout
     * Headers: Authorization: Bearer {token}
     *
     * Deletes the current token so it can't be used again.
     */
    public function logout(Request $request): JsonResponse
    {
        // Delete the token that was used for this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * GET CURRENT USER INFO
     *
     * GET /api/me
     * Headers: Authorization: Bearer {token}
     *
     * Returns the profile of whoever is currently logged in.
     * The frontend calls this on page load to check if the
     * user is still authenticated.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id'                => $user->id,
                'first_name'        => $user->first_name,
                'last_name'         => $user->last_name,
                'email'             => $user->email,
                'role'              => $user->role,
                'full_name'         => $user->full_name,
                'email_verified_at' => $user->email_verified_at,
                'avatar'            => $user->avatar,
                'created_at'        => $user->created_at,
            ],
        ]);
    }

    /**
     * FORGOT PASSWORD — RESET PASSWORD DIRECTLY
     *
     * POST /api/forgot-password
     * Body: { email, password, password_confirmation }
     *
     * Simplified password reset: just provide email and new password.
     * No email verification or token required.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No account found with this email address.'],
            ]);
        }

        // Check that new password is different from current
        if (Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['New password must be different from your current password.'],
            ]);
        }

        // Update password
        $user->update(['password' => $request->password]);

        // Delete all existing tokens — force re-login with new password
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password has been reset successfully. Please login with your new password.',
        ]);
    }

    /**
     * RESET PASSWORD — SET NEW PASSWORD
     *
     * POST /api/reset-password
     * Body: { token, email, password, password_confirmation }
     *
     * The user clicks the link from their email, which contains
     * the token. The frontend sends the token + new password here.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
        ]);

        // Check that new password is different from current
        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['New password must be different from your current password.'],
            ]);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->update(['password' => $password]);

                // Delete all existing tokens — force re-login with new password
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * RESEND EMAIL VERIFICATION
     *
     * POST /api/email/resend
     * Headers: Authorization: Bearer {token}
     *
     * Resends the verification email if user hasn't verified yet.
     */
    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email is already verified.',
            ]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent.',
        ]);
    }
}
