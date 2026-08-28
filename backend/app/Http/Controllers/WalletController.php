<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Top-up a user's credit balance.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function topup(Request $request, string $id): JsonResponse
    {
        // SECURITY GATE: admin only
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $userToTopup = User::find($id);

        if (!$userToTopup) {
            return response()->json(['message' => 'User not found'], 404);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($userToTopup, $validated) {
            $userToTopup->increment('credit_balance', $validated['amount']);

            \App\Models\Transaction::create([
                'user_id' => $userToTopup->id,
                'gym_id' => null,
                'amount' => $validated['amount'],
                'pin_code' => 'TOPUP',
                'status' => 'completed',
                'expires_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Top-up successful',
            'user' => $userToTopup->fresh(),
        ], 200);
    }
}
