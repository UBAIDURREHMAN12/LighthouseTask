<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\auth\GoogleController;
use App\Http\Controllers\api\lighthouse\LighthouseController;

Route::post('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/lighthouse/test', [LighthouseController::class, 'runLighthouseTest']);
    Route::post('/logout', [GoogleController::class, 'logout']);
});