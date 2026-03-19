<?php
/**
 * Authentication Endpoint: Logout
 * 
 * Destroys the user's session and clears authentication
 * 
 * @endpoint POST /api/logout.php
 * 
 * @returns {object}
 * - status: "ok" on success, "failed" on error
 * - message: Human-readable message
 * 
 * @examples
 * 
 * Request:
 * POST /api/logout.php
 * 
 * Response (200 OK):
 * {
 *   "status": "ok",
 *   "message": "Logged out successfully"
 * }
 */

// Set CORS headers
// Allow credentials: dynamically set origin instead of using wildcard
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Start session to access existing session data
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Log the logout
    if (isset($_SESSION['username'])) {
        error_log("User {$_SESSION['username']} logged out from {$_SERVER['REMOTE_ADDR']}");
    }
    
    // Clear all session variables
    $_SESSION = [];
    
    // Destroy the session
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        "status" => "ok",
        "message" => "Logged out successfully"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    error_log("Logout error: " . $e->getMessage());
    echo json_encode([
        "status" => "failed",
        "message" => "Error during logout"
    ]);
}
?>
