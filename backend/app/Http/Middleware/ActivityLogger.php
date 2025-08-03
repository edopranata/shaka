<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ActivityLogger
{
    /**
     * Handle an incoming request and log user activities.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log for authenticated users
        if (Auth::check()) {
            $this->logActivity($request, $response);
        }

        return $response;
    }

    /**
     * Log the user activity
     */
    private function logActivity(Request $request, Response $response): void
    {
        // Skip logging for certain routes
        $skipRoutes = [
            'api/me',
            'docs',
            'sanctum/csrf-cookie',
        ];

        $path = $request->path();
        foreach ($skipRoutes as $skipRoute) {
            if (str_contains($path, $skipRoute)) {
                return;
            }
        }

        // Determine action based on HTTP method and route
        $action = $this->determineAction($request, $response);

        if ($action) {
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'model_type' => $this->extractModelType($request),
                'model_id' => $this->extractModelId($request),
                'changes' => $this->extractChanges($request, $response),
                'metadata' => [
                    'route' => $request->route()?->getName(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status_code' => $response->getStatusCode(),
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'session_id' => $request->session()?->getId(),
            ]);
        }
    }

    /**
     * Determine the action based on request and response
     */
    private function determineAction(Request $request, Response $response): ?string
    {
        $method = $request->method();
        $statusCode = $response->getStatusCode();
        $path = $request->path();

        // Authentication actions
        if (str_contains($path, 'login')) {
            return $statusCode === 200 ? 'login' : 'login_failed';
        }
        if (str_contains($path, 'logout')) {
            return 'logout';
        }
        if (str_contains($path, 'refresh')) {
            return 'token_refresh';
        }

        // CRUD actions
        switch ($method) {
            case 'POST':
                return $statusCode >= 200 && $statusCode < 300 ? 'create' : 'create_failed';
            case 'PUT':
            case 'PATCH':
                return $statusCode >= 200 && $statusCode < 300 ? 'update' : 'update_failed';
            case 'DELETE':
                return $statusCode >= 200 && $statusCode < 300 ? 'delete' : 'delete_failed';
            case 'GET':
                // Only log certain GET requests
                if (str_contains($path, '/export') || str_contains($path, '/report')) {
                    return 'export';
                }
                return null; // Don't log regular GET requests
            default:
                return null;
        }
    }

    /**
     * Extract model type from request
     */
    private function extractModelType(Request $request): ?string
    {
        $path = $request->path();

        // Map API paths to model types
        $modelMap = [
            'users' => 'App\Models\User',
            'products' => 'App\Models\Product',
            'categories' => 'App\Models\Category',
            'transactions' => 'App\Models\Transaction',
            'customers' => 'App\Models\Customer',
        ];

        foreach ($modelMap as $pathSegment => $modelClass) {
            if (str_contains($path, $pathSegment)) {
                return $modelClass;
            }
        }

        return null;
    }

    /**
     * Extract model ID from request
     */
    private function extractModelId(Request $request): ?int
    {
        // Try to get ID from route parameters
        $route = $request->route();
        if ($route) {
            $parameters = $route->parameters();

            // Common ID parameter names
            $idParams = ['id', 'user', 'product', 'category', 'transaction', 'customer'];

            foreach ($idParams as $param) {
                if (isset($parameters[$param]) && is_numeric($parameters[$param])) {
                    return (int) $parameters[$param];
                }
            }
        }

        return null;
    }

    /**
     * Extract changes from request and response
     */
    private function extractChanges(Request $request, Response $response): array
    {
        $changes = [];

        // For create/update operations, log the request data
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            $requestData = $request->except(['password', 'password_confirmation', '_token']);
            if (!empty($requestData)) {
                $changes['new'] = $requestData;
            }
        }

        return $changes;
    }
}
