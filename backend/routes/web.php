<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
     
     Route::get('/api', [NewsController::class, 'index']);
     Route::get('/api/news', [NewsController::class, 'allNews']);