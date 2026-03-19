<?php
// Error logging for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
$logFile = __DIR__ . '/../api_errors.log';
ini_set('log_errors', 1);
ini_set('error_log', $logFile);

// Start output buffering to prevent errors from breaking JSON
ob_start();

// Set CORS headers
// Use dynamic origin instead of wildcard to support credentials
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$dbHosts = ["localhost:3306", "localhost:3307"];
$username = "root";
$password = "";
$dbname = "student_db";
$conn = null;
$connectedHost = null;
$connectionErrors = [];

foreach ($dbHosts as $host) {
  try {
    $testConn = new mysqli($host, $username, $password, $dbname);

    if (!$testConn->connect_error) {
      $testConn->set_charset("utf8");
      $conn = $testConn;
      $connectedHost = $host;
      break;
    } else {
      $connectionErrors[] = $host . " => " . $testConn->connect_error;
      $testConn->close();
    }
  } catch (mysqli_sql_exception $e) {
    // Connection failed, try next host
    $connectionErrors[] = $host . " => " . $e->getMessage();
  } catch (Exception $e) {
    // Catch any other exceptions
    $connectionErrors[] = $host . " => " . $e->getMessage();
  }
}

if (!$conn) {
  http_response_code(500);
  die(json_encode([
    "status" => "failed",
    "message" => "Database connection failed",
    "tried_hosts" => $dbHosts,
    "details" => $connectionErrors
  ]));
}
