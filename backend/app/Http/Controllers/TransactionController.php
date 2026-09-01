<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Gym;
use App\Models\Transaction;
use App\Models\TopupTransaction;
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

        return DB::transaction(function () use ($user, $validated) {
            $hasPending = Transaction::where('user_id', $user->id)
                ->where('status', 'pending')
                ->exists();

            if ($hasPending) {
                return response()->json(['message' => 'Anda sudah memiliki 1 check-in pending'], 400);
            }

            $gym = Gym::find($validated['gym_id']);

            $lockedUser = \App\Models\User::where('id', $user->id)->lockForUpdate()->first();

            if ($lockedUser->available_credits < $gym->credit_price) {
                return response()->json(['message' => 'Saldo kredit yang tersedia tidak mencukupi.'], 422);
            }

            // credit_balance is NOT decremented here. 
            // pending_credits accessor handles the escrow balance reduction dynamically.

            $pinCode = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            $expiresAt = now()->addHour();

            $transaction = Transaction::create([
                'user_id' => $lockedUser->id,
                'gym_id' => $gym->id,
                'amount' => $gym->credit_price,
                'pin_code' => $pinCode,
                'status' => 'pending',
                'expires_at' => $expiresAt,
            ]);

            $transaction->load('gym');

            return response()->json([
                'message' => 'Check-in berhasil diinisiasi.',
                'data' => [
                    'id' => $transaction->id,
                    'transaction_id' => $transaction->id,
                    'gym_id' => $transaction->gym_id,
                    'gym_name' => $transaction->gym->name ?? $gym->name,
                    'pin_code' => (string) $transaction->pin_code,
                    'amount' => (int) $transaction->amount,
                    'status' => $transaction->status,
                    'expires_at' => $transaction->expires_at->toIso8601String(),
                ]
            ], 201);
        });
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

        return DB::transaction(function () use ($mitra, $validated) {
            $transaction = Transaction::where('pin_code', $validated['pin_code'])
                ->where('status', 'pending')
                ->lockForUpdate()
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

            // Settlement: Permanently deduct the credit_balance
            $lockedUser = \App\Models\User::where('id', $transaction->user_id)->lockForUpdate()->first();
            $lockedUser->decrement('credit_balance', $transaction->amount);

            $transaction->update([
                'status' => 'completed',
                'validated_at' => now(),
                'validated_by' => $mitra->id,
            ]);

            return response()->json([
                'message' => 'Validasi check-in berhasil.',
                'data' => $transaction
            ], 200);
        });
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
            // 1. Ambil Riwayat Check-in Gym
            $checkins = Transaction::where('user_id', $user->id)
                ->with('gym')
                ->latest()
                ->get()
                ->map(function ($tx) {
                    return [
                        'id' => (string) $tx->id,
                        'gym_id' => $tx->gym_id,
                        'gym_name' => $tx->gym->name ?? 'Gym',
                        'type' => 'deduction',
                        'amount' => (int) $tx->amount,
                        'status' => $tx->status,
                        'pin_code' => $tx->pin_code,
                        'expires_at' => $tx->expires_at?->toIso8601String(),
                        'created_at' => $tx->created_at?->toIso8601String(),
                    ];
                });

            // 2. Ambil Riwayat Top-up Midtrans
            $topups = TopupTransaction::where('user_id', $user->id)
                ->with('topupPackage')
                ->latest()
                ->get()
                ->map(function ($tp) {
                    return [
                        'id' => (string) $tp->id,
                        'gym_id' => null,
                        'gym_name' => $tp->topupPackage?->name ?? 'Top Up Saldo',
                        'type' => 'topup',
                        'amount' => (int) $tp->total_credits,
                        'status' => $tp->status,
                        'pin_code' => null,
                        'expires_at' => null,
                        'created_at' => $tp->created_at?->toIso8601String(),
                    ];
                });

            // 3. Gabungkan dan Urutkan Kronologis Terbaru (DESC)
            $merged = $checkins->concat($topups)
                ->sortByDesc('created_at')
                ->values();

            return response()->json([
                'data' => $merged
            ], 200);

        } elseif ($user->role === 'mitra') {
            $transactions = Transaction::whereHas('gym', function ($query) use ($user) {
                $query->where('mitra_id', $user->id);
            })
                ->with(['gym', 'user'])
                ->latest()
                ->paginate(15);

            return response()->json($transactions, 200);

        } elseif ($user->role === 'admin') {
            $transactions = Transaction::with(['gym', 'user'])
                ->latest()
                ->paginate(15);

            return response()->json($transactions, 200);

        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }

    /**
     * Get a specific transaction by ID.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $transaction = Transaction::findOrFail($id);

        // Authorization check: user can only view their own, mitra can view gyms they own
        $user = $request->user();
        if ($user->role === 'user' && $transaction->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'mitra' && $transaction->gym && $transaction->gym->mitra_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['data' => $transaction], 200);
    }

    /**
     * Cancel a pending transaction.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        return DB::transaction(function () use ($request, $id) {
            $transaction = Transaction::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->where('status', 'pending')
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                return response()->json(['message' => 'Transaksi tidak dapat dibatalkan.'], 400);
            }

            $transaction->update(['status' => 'cancelled']);

            // Available credits automatically restored via the pending_credits accessor logic

            return response()->json([
                'message' => 'Transaksi berhasil dibatalkan.'
            ], 200);
        });
    }

    /**
     * Get the active pending transaction for the user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function activePending(Request $request): JsonResponse
    {
        $transaction = Transaction::with('gym')
            ->where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        return response()->json(['data' => $transaction], 200);
    }
}
