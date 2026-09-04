<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class MidtransService
{
    /**
     * Get Midtrans endpoint URL based on environment.
     */
    protected function getEndpoint(): string
    {
        $isProduction = config('services.midtrans.is_production');

        return $isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
    }

    /**
     * Create Snap Token from Midtrans API.
     *
     * @param array $params
     * @return string
     * @throws Exception
     */
    public function createSnapToken(array $params): string
    {
        $serverKey = config('services.midtrans.server_key');
        $endpoint = $this->getEndpoint();

        $params['expiry'] = [
            'start_time' => date("Y-m-d H:i:s O"),
            'unit' => 'minute',
            'duration' => 15
        ];

        $response = Http::timeout(4)->connectTimeout(2)->withHeaders([
            'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($endpoint, $params);

        if ($response->failed()) {
            throw new Exception('Midtrans API Error: ' . $response->body());
        }

        return $response->json()['token'];
    }

    public function getTransactionStatus(string $orderId): array
    {
        $isProduction = config('services.midtrans.is_production');
        $baseUrl = $isProduction
            ? 'https://api.midtrans.com/v2/'
            : 'https://api.sandbox.midtrans.com/v2/';

        $serverKey = config('services.midtrans.server_key');

        // Optimasi koneksi cepat
        $response = Http::timeout(4)
            ->connectTimeout(2)
            ->withHeaders([
                'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
                'Accept' => 'application/json',
            ])->get($baseUrl . $orderId . '/status');

        if ($response->failed()) {
            throw new Exception('Gagal memeriksa status ke Midtrans: ' . $response->body());
        }

        return $response->json();
    }

    public function cancelTransaction(string $orderId): array
    {
        $isProduction = config('services.midtrans.is_production');
        $baseUrl = $isProduction
            ? 'https://api.midtrans.com/v2/'
            : 'https://api.sandbox.midtrans.com/v2/';

        $serverKey = config('services.midtrans.server_key');

        $response = Http::timeout(4)->connectTimeout(2)->withHeaders([
            'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            'Accept' => 'application/json',
        ])->post($baseUrl . $orderId . '/cancel');

        if ($response->failed()) {
            throw new Exception('Gagal membatalkan transaksi di Midtrans: ' . $response->body());
        }

        return $response->json();
    }
}
