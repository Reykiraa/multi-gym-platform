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
        ]);

        $userToTopup = User::find($id);

        if (!$userToTopup) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userToTopup->increment('credit_balance', $validated['amount']);

        // Refresh the model to get the updated credit_balance
        $userToTopup->refresh();

        return response()->json([
            'message' => 'Top-up successful',
            'credit_balance' => $userToTopup->credit_balance,
        ], 200);
    }
}
