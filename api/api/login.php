<?php
/**
 * Authentication Endpoint: Login
 * 
 * Authenticates a user with username/password and creates a session
 * 
 * @endpoint POST /api/login.php
 * @param {string} username - User's username
 * @param {string} password - User's password (plain text)
 * 
 * @returns {object} 
 * - status: "ok" on success, "failed" on error
 * - message: Human-readable message
 * - user: {id, username, email, first_name, last_name} on success
 * - session_id: PHP session ID on success
 * 
 * @examples
 * 
 * Request (JSON):
 * POST /api/login.php
 * Content-Type: application/json
 * 
 * {
 *   "username": "admin",
 *   "password": "password123"
 * }
 * 
 * Response (200 OK):
 * {
 *   "status": "ok",
 *   "message": "Login successful",
 *   "user": {
 *     "id": 1,
 *     "username": "admin",
 *     "email": "admin@school.edu",
 *     "first_name": "Admin",
 *     "last_name": "User"
 *   },
 *   "session_id": "abc123def456..."
 * }
 * 
 * Response (401 Unauthorized):
 * {
 *   "status": "failed",
 *   "message": "Invalid username or password"
 * }
 */

// Enable error logging for debugging
ini_set('log_errors', 1);
ini_set('error_log', dirname(__FILE__) . '/auth.log');
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Handle fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR])) {
        error_log("FATAL ERROR: {$error['message']} in {$error['file']} on line {$error['line']}");
    }
});

// START OUTPUT BUFFERING FIRST to capture any errors
ob_start();

// THEN configure session options before starting
session_set_cookie_params([
    'lifetime' => 3600,      // 1 hour
    'path' => '/',
    'domain' => '',
    'secure' => ($_SERVER['HTTPS'] ?? false) ? true : false,   // HTTPS only in production
    'httponly' => true,      // Cannot be accessed by JavaScript
    'samesite' => 'Lax'       // CSRF protection
]);

// Start session
session_start();

// Set CORS headers for cross-origin requests
// Allow credentials: dynamically set origin instead of using wildcard
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "failed",
        "message" => "Method not allowed. Use POST."
    ]);
    exit;
}

try {
    error_log("=== Login attempt started ===");
    
    // Include database configuration
    require_once __DIR__ . '/config.php';
    error_log("Config included successfully");
    
    // Check if connection exists
    if (!isset($conn) || !$conn) {
        error_log("Database connection failed or not set");
        throw new Exception("Database connection unavailable");
    }
    error_log("Database connection verified");
    
    // Extract credentials from request
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $username = '';
    $password = '';
    
    // Support both JSON and form-encoded requests
    if (strpos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
    } else {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
    }
    
    error_log("Credentials extracted - username: {$username}");
    
    // Validate input
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            "status" => "failed",
            "message" => "Username and password are required"
        ]);
        ob_end_flush();
        exit;
    }
    
    // Sanitize username (alphanumeric, underscore, hyphen only)
    $username = preg_replace('/[^a-zA-Z0-9_-]/', '', $username);
    
    if (empty($username)) {
        http_response_code(400);
        echo json_encode([
            "status" => "failed",
            "message" => "Invalid username format"
        ]);
        ob_end_flush();
        exit;
    }
    
    // Query user from database
    $query = "SELECT id, username, email, password_hash, first_name, last_name, is_active 
              FROM users 
              WHERE username = ? AND is_active = true";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        http_response_code(500);
        error_log("Database error: " . $conn->error);
        echo json_encode([
            "status" => "failed",
            "message" => "Database error. Please try again later."
        ]);
        ob_end_flush();
        exit;
    }
    
    $stmt->bind_param("s", $username);
    if (!$stmt->execute()) {
        http_response_code(500);
        error_log("Query execution error: " . $stmt->error);
        echo json_encode([
            "status" => "failed",
            "message" => "Database error. Please try again later."
        ]);
        $stmt->close();
        ob_end_flush();
        exit;
    }
    
    $result = $stmt->get_result();
    
    // Check if user exists
    if ($result->num_rows !== 1) {
        http_response_code(401);
        echo json_encode([
            "status" => "failed",
            "message" => "Invalid username or password"
        ]);
        $stmt->close();
        ob_end_flush();
        exit;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Verify password using bcrypt
    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode([
            "status" => "failed",
            "message" => "Invalid username or password"
        ]);
        ob_end_flush();
        exit;
    }
    
    // Update last login timestamp
    $updateQuery = "UPDATE users SET last_login = NOW() WHERE id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    if ($updateStmt) {
        $updateStmt->bind_param("i", $user['id']);
        $updateStmt->execute();
        $updateStmt->close();
    }
    
    // Set session data (session already started at the top of the file)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['login_time'] = time();
    $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'] ?? '';
    $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Success response
    http_response_code(200);
    echo json_encode([
        "status" => "ok",
        "message" => "Login successful",
        "user" => [
            "id" => (int)$user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "first_name" => $user['first_name'],
            "last_name" => $user['last_name']
        ],
        "session_id" => session_id()
    ]);
    
    error_log("User {$user['username']} logged in from {$_SERVER['REMOTE_ADDR']}");
    
} catch (Exception $e) {
    http_response_code(500);
    $errorMsg = $e->getMessage();
    $errorTrace = $e->getTraceAsString();
    error_log("Login error: " . $errorMsg);
    error_log("Stack trace: " . $errorTrace);
    echo json_encode([
        "status" => "failed",
        "message" => "An error occurred. Please try again later.",
        "debug" => [
            "error" => $errorMsg,
            "type" => get_class($e)
        ]
    ]);
} catch (Throwable $t) {
    // Catch any Throwable (includes Error and Exception)
    http_response_code(500);
    $errorMsg = $t->getMessage();
    $errorTrace = $t->getTraceAsString();
    error_log("Throwable caught: " . $errorMsg);
    error_log("Stack trace: " . $errorTrace);
    echo json_encode([
        "status" => "failed",
        "message" => "An error occurred. Please try again later.",
        "debug" => [
            "error" => $errorMsg,
            "type" => get_class($t)
        ]
    ]);
}

ob_end_flush();
?>
