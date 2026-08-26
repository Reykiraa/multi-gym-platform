<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GymController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/gyms', [GymController::class, 'index']);
    Route::post('/gyms', [GymController::class, 'store']);
    Route::put('/gyms/{id}', [GymController::class, 'update']);
    Route::delete('/gyms/{id}', [GymController::class, 'destroy']);

    // Transactions
    Route::post('/transactions/checkin', [TransactionController::class, 'checkin']);
    Route::post('/transactions/validate', [TransactionController::class, 'validatePin']);
    Route::get('/transactions', [TransactionController::class, 'index']);

    // Wallet
    Route::post('/users/{id}/topup', [WalletController::class, 'topup']);
});
