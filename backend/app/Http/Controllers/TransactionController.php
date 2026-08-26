<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Gym;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Check in to a gym (generate PIN).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkin(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'user') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'gym_id' => 'required|integer|exists:gyms,id',
        ]);

        $gym = Gym::find($validated['gym_id']);

        if ($user->credit_balance < $gym->credit_price) {
            return response()->json(['message' => 'Insufficient credit balance'], 400);
        }

        $pinCode = str_pad((string)random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $expiresAt = now()->addHours(2);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'gym_id' => $gym->id,
            'amount' => $gym->credit_price,
            'pin_code' => $pinCode,
            'status' => 'pending',
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'message' => 'Check-in initiated successfully',
            'transaction' => [
                'id' => $transaction->id,
                'user_id' => $transaction->user_id,
                'gym_id' => $transaction->gym_id,
                'amount' => $transaction->amount,
                'pin_code' => $transaction->pin_code,
                'status' => $transaction->status,
                'expires_at' => $transaction->expires_at->toIso8601String(),
                'created_at' => $transaction->created_at,
                'updated_at' => $transaction->updated_at,
            ]
        ], 201);
    }

    /**
     * Validate PIN code and complete transaction.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function validatePin(Request $request): JsonResponse
    {
        $mitra = $request->user();

        if ($mitra->role !== 'mitra') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'pin_code' => 'required|string|size:4',
        ]);

        $transaction = Transaction::where('pin_code', $validated['pin_code'])
            ->where('status', 'pending')
            ->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found or already processed'], 400);
        }

        if (now()->greaterThan($transaction->expires_at)) {
            $transaction->update(['status' => 'expired']);
            return response()->json(['message' => 'PIN code expired'], 400);
        }

        // Validate if mitra owns the gym associated with the transaction
        if ($transaction->gym->mitra_id !== $mitra->id) {
            return response()->json(['message' => 'Forbidden: You do not own this gym'], 403);
        }

        DB::transaction(function () use ($transaction) {
            $transaction->update(['status' => 'completed']);
            $transaction->user->decrement('credit_balance', $transaction->amount);
        });

        return response()->json(['message' => 'Validation successful, credit deducted'], 200);
    }

    /**
     * Get transactions based on role.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'user') {
            $transactions = Transaction::where('user_id', $user->id)
                ->with('gym')
                ->latest()
                ->paginate(15);
        } elseif ($user->role === 'mitra') {
            $transactions = Transaction::whereHas('gym', function ($query) use ($user) {
                $query->where('mitra_id', $user->id);
            })
                ->with(['gym', 'user'])
                ->latest()
                ->paginate(15);
        } elseif ($user->role === 'admin') {
            $transactions = Transaction::with(['gym', 'user'])
                ->latest()
                ->paginate(15);
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($transactions, 200);
    }
}
