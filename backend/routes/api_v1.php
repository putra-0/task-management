<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ListController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)
    ->prefix('auth')
    ->group(function () {
        Route::withoutMiddleware('verify.user')->group(function () {
            Route::post('register', 'register');
            Route::post('login', 'login');
            Route::post('verify-otp', 'verifyOtp');
        });

        Route::post('logout', 'logout')->name('logout');
        Route::get('profile', 'getProfile');
    });

Route::controller(TaskController::class)
    ->prefix('tasks')
    ->group(function () {
        Route::get('', 'index');
        Route::post('', 'store');
        Route::put('{uuid}', 'update');
        Route::delete('{uuid}', 'destroy');
    });

Route::controller(ListController::class)
    ->prefix('lists')
    ->group(function () {
        Route::get('task-statuses', 'getTaskStatuses');
    });
