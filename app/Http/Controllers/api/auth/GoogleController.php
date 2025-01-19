<?php

namespace App\Http\Controllers\api\auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
 
public function handleGoogleCallback(Request $request)
{
    
    $token = $request->input('token');
    
    // Validate token with Google's API
    $googleResponse = Http::get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={$token}");

    if ($googleResponse->failed()) {
        return response()->json(['error' => 'Invalid token'], 401);
    }

    $googleUser = $googleResponse->json();

    // Find or create the user
    $user = User::firstOrCreate(
        ['google_id' => $googleUser['sub']],
        [
            'name' => $googleUser['name'],
            'email' => $googleUser['email'],
            'avatar' => $googleUser['picture'],
            'password' => '12345678',
        ]
    );

    $user['token'] =  $user->createToken('MyApp')->plainTextToken;
    
    Auth::login($user);

    return response()->json(['message' => 'Login successful', 'user' => $user]);
}

public function logout(Request $request)
{
    // Revoke the token used in the request
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logged out successfully']);
}

}
