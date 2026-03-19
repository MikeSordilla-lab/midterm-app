<?php
/**
 * Authentication Endpoint: Check Auth Status
 * 
 * Verifies if the current session is valid and returns user information
 * 
 * @endpoint GET /api/auth/check.php
 * 
 * @returns {object}
 * - isAuthenticated: boolean - whether user is logged in
 * - user: {id, username, email, first_name, last_name} if authenticated
 * - message: Status message
 * 
 * @examples
 * 
 * Request:
 * GET /api/auth/check.php
 * 
 * Response (200 OK - Authenticated):
 * {
 *   "isAuthenticated": true,
 *   "user": {
 *     "id": 1,
 *     "username": "admin",
 *     "email": "admin@school.edu",
 *     "first_name": "Admin",
 *     "last_name": "User"
 *   },
 *   "message": "User is authenticated"
 * }
 * 
 * Response (200 OK - Not Authenticated):
 * {
 *   "isAuthenticated": false,
 *   "message": "User is not authenticated"
 * }
 */

// Set CORS headers
// Allow credentials: dynamically set origin instead of using wildcard
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "isAuthenticated" => false,
        "message" => "Method not allowed"
    ]);
    exit;
}

try {
    // Start session to check authentication
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Check if user is authenticated
    if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
        // Verify session hasn't expired (optional: 1 hour timeout)
        $sessionTimeout = 3600; // 1 hour
        if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > $sessionTimeout) {
            // Session expired
            session_destroy();
            http_response_code(200);
            echo json_encode([
                "isAuthenticated" => false,
                "message" => "Session expired"
            ]);
            exit;
        }
        
        // User is authenticated
        http_response_code(200);
        echo json_encode([
            "isAuthenticated" => true,
            "user" => [
                "id" => (int)$_SESSION['user_id'],
                "username" => $_SESSION['username'],
                "email" => $_SESSION['email'] ?? null,
                "first_name" => $_SESSION['first_name'] ?? null,
                "last_name" => $_SESSION['last_name'] ?? null
            ],
            "message" => "User is authenticated"
        ]);
    } else {
        // User is not authenticated
        http_response_code(200);
        echo json_encode([
            "isAuthenticated" => false,
            "message" => "User is not authenticated"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    error_log("Auth check error: " . $e->getMessage());
    echo json_encode([
        "isAuthenticated" => false,
        "message" => "Error checking authentication"
    ]);
}
?>
