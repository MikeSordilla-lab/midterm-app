<?php

/**
 * Login Diagnostics Endpoint
 * Helps troubleshoot authentication issues
 */

require_once __DIR__ . '/config.php';

// Set CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$diagnostics = [
  'timestamp' => date('Y-m-d H:i:s'),
  'database' => [],
  'auth' => [],
  'errors' => [],
];

// 1. Check database connection
$diagnostics['database']['connected'] = !empty($conn);
$diagnostics['database']['host'] = $connectedHost ?? 'Not connected';

if ($conn) {
  // 2. Check users table exists
  $tableCheck = $conn->query("SHOW TABLES LIKE 'users'");
  $diagnostics['database']['users_table_exists'] = $tableCheck && $tableCheck->num_rows > 0;

  // 3. Check users table structure
  if ($diagnostics['database']['users_table_exists']) {
    $columnsResult = $conn->query("DESCRIBE users");
    $columns = [];
    while ($row = $columnsResult->fetch_assoc()) {
      $columns[] = $row['Field'];
    }
    $diagnostics['database']['users_table_columns'] = $columns;

    // 4. Count users in table
    $countResult = $conn->query("SELECT COUNT(*) as count FROM users");
    $countRow = $countResult->fetch_assoc();
    $diagnostics['database']['total_users'] = $countRow['count'];

    // 5. Check for admin user
    $adminCheck = $conn->query("SELECT id, username, is_active FROM users WHERE username = 'admin'");
    if ($adminCheck && $adminCheck->num_rows > 0) {
      $adminUser = $adminCheck->fetch_assoc();
      $diagnostics['auth']['admin_exists'] = true;
      $diagnostics['auth']['admin_id'] = $adminUser['id'];
      $diagnostics['auth']['admin_is_active'] = (bool)$adminUser['is_active'];
    } else {
      $diagnostics['auth']['admin_exists'] = false;
      $diagnostics['errors'][] = 'Admin user not found in database';
    }
  } else {
    $diagnostics['errors'][] = 'Users table does not exist';
  }
} else {
  $diagnostics['errors'][] = 'Database connection failed';
  $diagnostics['errors'] = array_merge($diagnostics['errors'], $connectionErrors);
}

// 6. Test a login attempt if username and password provided
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true) ?? [];
  $testUsername = $input['test_username'] ?? '';
  $testPassword = $input['test_password'] ?? '';

  if ($testUsername && $testPassword && $conn) {
    $diagnostics['auth']['test_login'] = [];

    // Sanitize username
    $testUsername = preg_replace('/[^a-zA-Z0-9_-]/', '', $testUsername);

    // Query user
    $query = "SELECT id, username, password_hash, is_active FROM users WHERE username = ? AND is_active = true";
    $stmt = $conn->prepare($query);

    if ($stmt) {
      $stmt->bind_param("s", $testUsername);
      if ($stmt->execute()) {
        $result = $stmt->get_result();
        $diagnostics['auth']['test_login']['user_found'] = $result->num_rows > 0;

        if ($result->num_rows > 0) {
          $user = $result->fetch_assoc();
          $diagnostics['auth']['test_login']['username_match'] = true;
          $diagnostics['auth']['test_login']['password_verify'] = password_verify($testPassword, $user['password_hash']);
        } else {
          $diagnostics['auth']['test_login']['username_match'] = false;
        }
      } else {
        $diagnostics['errors'][] = 'Database query failed: ' . $stmt->error;
      }
      $stmt->close();
    } else {
      $diagnostics['errors'][] = 'Prepared statement failed: ' . $conn->error;
    }
  }
}

http_response_code(200);
echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
