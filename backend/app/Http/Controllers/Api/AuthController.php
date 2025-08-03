<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * @group Authentication
 *
 * APIs for user authentication and authorization
 */
class AuthController extends Controller
{
    /**
     * User Login
     *
     * Authenticate user and return access token
     *
     * @bodyParam email string required The user's email or username. Example: admin@example.com
     * @bodyParam password string required The user's password. Example: password123
     *
     * @response 200 {
     *   "user": {
     *     "id": 1,
     *     "name": "Admin User",
     *     "email": "admin@example.com",
     *     "username": "admin",
     *     "is_active": true,
     *     "roles": [
     *       {
     *         "id": 1,
     *         "name": "admin",
     *         "permissions": []
     *       }
     *     ]
     *   },
     *   "token": "1|abc123token",
     *   "message": "Login successful"
     * }
     *
     * @response 422 {
     *   "message": "The provided credentials are incorrect.",
     *   "errors": {
     *     "email": ["The provided credentials are incorrect."]
     *   }
     * }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->orWhere('username', $request->email)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated.'],
            ]);
        }

        $token = $user->createToken('pos-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
            'message' => 'Login successful'
        ]);
    }

    /**
     * User Logout
     *
     * Logout the authenticated user and revoke current access token
     *
     * @authenticated
     *
     * @response 200 {
     *   "message": "Logout successful"
     * }
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Get Current User
     *
     * Get the authenticated user's information with roles and permissions
     *
     * @authenticated
     *
     * @response 200 {
     *   "user": {
     *     "id": 1,
     *     "name": "Admin User",
     *     "email": "admin@example.com",
     *     "username": "admin",
     *     "is_active": true,
     *     "roles": [
     *       {
     *         "id": 1,
     *         "name": "admin",
     *         "permissions": []
     *       }
     *     ]
     *   }
     * }
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('roles.permissions')
        ]);
    }

    /**
     * Refresh Token
     *
     * Refresh the user's access token by revoking current token and creating a new one
     *
     * @authenticated
     *
     * @response 200 {
     *   "user": {
     *     "id": 1,
     *     "name": "Admin User",
     *     "email": "admin@example.com",
     *     "username": "admin",
     *     "is_active": true,
     *     "roles": []
     *   },
     *   "token": "2|newTokenString",
     *   "message": "Token refreshed successfully"
     * }
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        $token = $user->createToken('pos-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
            'message' => 'Token refreshed successfully'
        ]);
    }
}
