<?php

namespace App\Http\Controllers;

use App\Models\TopupPackage;
use App\Models\TopupTransaction;
use App\Models\User;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TopupController extends Controller
{
    /**
     * Get all active topup packages.
     */
    public function index(): JsonResponse
    {
        $packages = TopupPackage::where('is_active', true)
            ->orderBy('price_idr')
            ->get();

        return response()->json([
            'data' => $packages,
        ], 200);
    }

    /**
     * Create a new topup transaction and get Snap token.
     */
    public function createTransaction(Request $request, MidtransService $midtransService): JsonResponse
    {
        $request->validate([
            'topup_package_id' => 'required|exists:topup_packages,id',
        ]);

        $package = TopupPackage::findOrFail($request->topup_package_id);
        $totalCredits = $package->credits + $package->bonus_credits;

        $orderId = 'TOPUP-' . $request->user()->id . '-' . time() . '-' . Str::random(4);

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $package->price_idr,
            ],
            'customer_details' => [
                'first_name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
        ];

        try {
            $snapToken = $midtransService->createSnapToken($params);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to connect to payment gateway', 'error' => $e->getMessage()], 500);
        }

        $transaction = TopupTransaction::create([
            'user_id' => $request->user()->id,
            'topup_package_id' => $package->id,
            'order_id' => $orderId,
            'amount_idr' => $package->price_idr,
            'total_credits' => $totalCredits,
            'snap_token' => $snapToken,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Transaksi top-up diinisiasi.',
            'order_id' => $transaction->order_id,
            'data' => $transaction,
            'snap_token' => $snapToken,
        ], 201);
    }

    /**
     * Handle webhook from Midtrans.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        // 1. Signature Key Verification
        $signature = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . config('services.midtrans.server_key'));

        if ($signature !== $request->signature_key) {
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        // 2. ACID Transaction & Ledger Update
        return DB::transaction(function () use ($request) {
            $trx = TopupTransaction::where('order_id', $request->order_id)->lockForUpdate()->firstOrFail();

            // Idempotency Guard
            if ($trx->status === 'success') {
                return response()->json(['message' => 'Already processed'], 200);
            }

            $status = $request->transaction_status;
            $fraud = $request->fraud_status;

            if ($status === 'settlement' || ($status === 'capture' && $fraud === 'accept')) {
                $user = User::where('id', $trx->user_id)->lockForUpdate()->first();
                $user->increment('credit_balance', $trx->total_credits);

                $trx->update([
                    'status' => 'success',
                    'payment_type' => $request->payment_type
                ]);

                defer(function () use ($user, $trx) {
                    try {
                        config(['mail.mailers.smtp.timeout' => 3]);
                        Mail::to($user->email)->send(new \App\Mail\TopupSuccessEmail($user, $trx));
                    } catch (\Throwable $e) {
                        \Log::error('Mail Delivery Error: ' . $e->getMessage());
                    }
                });
            } elseif (in_array($status, ['cancel', 'deny', 'expire'])) {
                $trx->update([
                    'status' => 'failed',
                    'payment_type' => $request->payment_type
                ]);
            }

            return response()->json(['message' => 'Webhook handled successfully'], 200);
        });
    }

    /**
     * Verify payment status directly with Midtrans for instant UI update.
     */
    public function verifyPayment(Request $request, string $orderId, MidtransService $midtransService): JsonResponse
    {
        $statusData = $midtransService->getTransactionStatus($orderId);
        $status = $statusData['transaction_status'] ?? null;
        $fraud = $statusData['fraud_status'] ?? null;
        $paymentType = $statusData['payment_type'] ?? null;

        return DB::transaction(function () use ($request, $orderId, $status, $fraud, $paymentType) {
            $trx = TopupTransaction::where('order_id', $orderId)
                ->where('user_id', $request->user()->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Idempotency check
            if ($trx->status === 'success') {
                return response()->json([
                    'message' => 'Transaksi sudah berhasil diproses sebelumnya.',
                    'data' => $trx
                ], 200);
            }

            if ($status === 'settlement' || ($status === 'capture' && $fraud === 'accept')) {
                $user = User::where('id', $trx->user_id)->lockForUpdate()->first();
                $user->increment('credit_balance', $trx->total_credits);

                $trx->update([
                    'status' => 'success',
                    'payment_type' => $paymentType,
                ]);

                defer(function () use ($user, $trx) {
                    try {
                        config(['mail.mailers.smtp.timeout' => 3]);
                        Mail::to($user->email)->send(new \App\Mail\TopupSuccessEmail($user, $trx));
                    } catch (\Throwable $e) {
                        \Log::error('Mail Delivery Error: ' . $e->getMessage());
                    }
                });

                return response()->json([
                    'message' => 'Pembayaran berhasil dikonfirmasi!',
                    'data' => $trx,
                    'user' => $user->fresh()
                ], 200);
            }

            return response()->json([
                'message' => 'Status transaksi saat ini: ' . $status,
                'data' => $trx
            ], 200);
        });
    }

    /**
     * Cancel a pending topup transaction.
     */
    public function cancel(Request $request, string $id, MidtransService $midtransService): JsonResponse
    {
        return DB::transaction(function () use ($request, $id, $midtransService) {
            $trx = TopupTransaction::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->where('status', 'pending')
                ->lockForUpdate()
                ->first();

            if (!$trx) {
                return response()->json(['message' => 'Transaksi tidak ditemukan atau sudah diproses.'], 400);
            }

            try {
                $midtransService->cancelTransaction($trx->order_id);
            } catch (\Throwable $e) {
                // Abaikan jika order belum terbentuk di Midtrans
            }

            // Gunakan 'failed' agar tidak melanggar check constraint PostgreSQL
            $trx->update(['status' => 'failed']);

            return response()->json([
                'message' => 'Transaksi top-up berhasil dibatalkan.',
                'data' => $trx
            ], 200);
        });
    }
}
