<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GymController;
use App\Http\Controllers\MitraController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::get('/users', [AuthController::class, 'index']);

    // Gym management
    Route::get('/gyms', [GymController::class, 'index']);
    Route::get('/gyms/{id}', [GymController::class, 'show']);
    Route::post('/gyms', [GymController::class, 'store']);
    Route::post('/gyms/branch', [GymController::class, 'storeBranch']);
    Route::put('/gyms/{id}', [GymController::class, 'update']);
    Route::delete('/gyms/{id}', [GymController::class, 'destroy']);

    // Mitra organization management
    Route::get('/mitras', [MitraController::class, 'index']);
    Route::post('/mitras', [MitraController::class, 'store']);
    Route::get('/mitras/{id}', [MitraController::class, 'show']);
    Route::put('/mitras/{id}', [MitraController::class, 'update']);
    Route::delete('/mitras/{id}', [MitraController::class, 'destroy']);

    // Transactions
    Route::post('/transactions/checkin', [TransactionController::class, 'checkin']);
    Route::get('/transactions/active-pending', [TransactionController::class, 'activePending']);
    Route::post('/transactions/{id}/cancel', [TransactionController::class, 'cancel']);
    Route::post('/mitra/transactions/validate-pin', [TransactionController::class, 'validatePin']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);

});
