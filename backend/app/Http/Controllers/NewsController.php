<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;

class NewsController extends Controller
{
    public function allNews()
    {
        return News::all();
    }

    public function index()
    {
        // Tu lógica existente aquí
    }
}