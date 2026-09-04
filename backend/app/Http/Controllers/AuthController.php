<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            // 'role' => 'required|string|in:admin,mitra,user',
        ]);

        // Create user, password will be hashed automatically by User model casts
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'user',
        ]);

        defer(function () use ($user) {
            try {
                config(['mail.mailers.smtp.timeout' => 3]);
                Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user));
            } catch (\Throwable $e) {
                \Log::error('Mail Delivery Error: ' . $e->getMessage());
            }
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * Authenticate user and issue a token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // Verify credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    /**
     * Authenticate user with Google.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'required|string',
        ]);

        $startTime = microtime(true);
        $idToken = $request->credential;
        try {
            $response = Http::timeout(3)->get("https://oauth2.googleapis.com/tokeninfo?id_token={$idToken}");
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Koneksi ke Google OAuth gagal / timeout.'], 504);
        }

        if (!$response->successful()) {
            return response()->json(['message' => 'Token Google tidak valid.'], 401);
        }

        $payload = $response->json();

        // Validasi audience
        if ($payload['aud'] !== config('services.google.client_id')) {
            return response()->json(['message' => 'Audience token tidak cocok.'], 401);
        }

        // Validasi email verified
        if (isset($payload['email_verified']) && $payload['email_verified'] !== 'true' && $payload['email_verified'] !== true) {
            return response()->json(['message' => 'Email belum diverifikasi oleh Google.'], 401);
        }

        $user = User::where('email', $payload['email'])->first();

        if (!$user) {
            // 1. Jika User Baru
            $user = User::create([
                'name' => $payload['name'] ?? 'User RoamFit',
                'email' => $payload['email'],
                'password' => Hash::make(Str::random(32)),
                'role' => 'user',
                'credit_balance' => 0,
                'is_oauth_user' => true, // Flag OAuth Aktif
            ]);

            defer(function () use ($user) {
                try {
                    config(['mail.mailers.smtp.timeout' => 3]);
                    Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user));
                } catch (\Throwable $e) {
                    \Log::error('Mail Delivery Error: ' . $e->getMessage());
                }
            });
        } else {
            // Set is_oauth_user = true agar menu "Buat Password" langsung muncul di profilnya
            if (!$user->is_oauth_user) {
                $user->update(['is_oauth_user' => true]);
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $duration = round((microtime(true) - $startTime) * 1000);
        \Log::info('Google Auth Success', ['user_id' => $user->id, 'duration_ms' => $duration]);

        return response()->json([
            'message' => 'Login Google berhasil.',
            'user' => $user->fresh(),
            'token' => $token,
        ], 200);
    }

    /**
     * Get authenticated user data.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user(), 200);
    }

    /**
     * Get all users (Admin only).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::when($request->role, fn($q, $r) => $q->where('role', $r))
            ->get(['id', 'name', 'email', 'role', 'credit_balance']);

        return response()->json($users, 200);
    }


    /**
     * Update user profile.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($request->filled('new_password')) {
            // Jika BUKAN user OAuth (user biasa), wajib verifikasi password saat ini
            if (!$user->is_oauth_user) {
                $request->validate([
                    'current_password' => 'required|string',
                    'new_password' => 'required|string|min:8',
                ]);

                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json(['message' => 'Password saat ini salah'], 422);
                }
            } else {
                // Jika user OAuth (Google), langsung buat password baru tanpa current_password
                $request->validate([
                    'new_password' => 'required|string|min:8',
                ]);
            }

            $user->password = $request->new_password; // akan di hash otomatis oleh model cast
            $user->is_oauth_user = false; // Sekarang user resmi memiliki password manual!
        }

        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        $user->save();

        return response()->json([
            'message' => 'Profil dan kata sandi berhasil diperbarui.',
            'user' => $user->fresh(),
        ], 200);
    }

    /**
     * Get all mitra accounts (Admin only).
     *
     * Returns a minimal projection (id, name, email) sufficient for the
     * "Tambah Cabang" dropdown in the Gym Manager form.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function mitras(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mitras = User::where('role', 'mitra')
            ->get(['id', 'name', 'email']);

        return response()->json($mitras, 200);
    }
}
