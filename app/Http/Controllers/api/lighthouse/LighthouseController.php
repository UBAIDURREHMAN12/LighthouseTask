<?php

namespace App\Http\Controllers\api\lighthouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LighthouseController extends Controller
{
    public function runLighthouseTest(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'platform' => 'required|in:Mobile,Desktop',
        ]);

        $url = $request->input('url');
        $platform = $request->input('platform');
        $strategy = strtolower($platform); // 'mobile' or 'desktop'

        $apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

        $response = Http::get($apiUrl, [
            'url' => $url,
            'strategy' => $strategy,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'error' => 'Failed to fetch performance data from Google API.',
                'details' => $response->json() ?? 'Unknown error',
            ], 500);
        }

        $data = $response->json();

        if (!isset($data['lighthouseResult']['categories']['performance']['score'])) {
            return response()->json([
                'error' => 'Performance score is missing in the API response.',
            ], 500);
        }

        $performanceScore = $data['lighthouseResult']['categories']['performance']['score'] * 100;

        // Extract additional data for charts/graphs
        $metrics = $data['lighthouseResult']['audits'] ?? [];
        $categories = $data['lighthouseResult']['categories'] ?? [];
        $timing = $data['lighthouseResult']['timing'] ?? null;

        return response()->json([
            'performance_score' => $performanceScore,
            'metrics' => $metrics,
            'categories' => $categories,
            'timing' => $timing,
        ]);
    }

}
