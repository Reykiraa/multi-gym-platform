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

        $response = Http::withHeaders([
            'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($endpoint, $params);

        if ($response->failed()) {
            throw new Exception('Midtrans API Error: ' . $response->body());
        }

        return $response->json()['token'];
    }
}
