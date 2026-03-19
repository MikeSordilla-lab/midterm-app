<?php
// Test endpoint to debug API connectivity
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Show all errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

ob_start();

$response = [
  "status" => "ok",
  "message" => "API test endpoint working",
  "timestamp" => date('Y-m-d H:i:s'),
  "php_version" => phpversion(),
  "server" => $_SERVER['SERVER_NAME'] ?? 'unknown',
  "request_method" => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
];

// Test database connection
$dbHosts = ["localhost:3306", "localhost:3307"];
$username = "root";
$password = "";
$dbname = "student_db";
$conn = null;
$connectionErrors = [];

foreach ($dbHosts as $host) {
  $testConn = @new mysqli($host, $username, $password, $dbname);

  if (!$testConn->connect_error) {
    $testConn->set_charset("utf8");
    $conn = $testConn;
    $response["database"] = [
      "status" => "connected",
      "host" => $host,
      "version" => $testConn->server_info,
      "dbname" => $dbname
    ];

    // Try to query the student table
    if ($result = $testConn->query("SELECT COUNT(*) as count FROM student_list")) {
      $row = $result->fetch_assoc();
      $response["database"]["table_status"] = "OK";
      $response["database"]["student_count"] = (int)$row['count'];
    } else {
      $response["database"]["table_status"] = "ERROR";
      $response["database"]["table_error"] = $testConn->error;
    }

    // List all tables
    if ($tableResult = $testConn->query("SHOW TABLES")) {
      $tables = [];
      while ($tRow = $tableResult->fetch_row()) {
        $tables[] = $tRow[0];
      }
      $response["database"]["tables"] = $tables;
    }

    $testConn->close();
    http_response_code(200);
    ob_end_clean();
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
  } else {
    $connectionErrors[] = [
      "host" => $host,
      "error" => $testConn->connect_error
    ];
  }
}

// If we get here, no connection was successful
$response["status"] = "failed";
$response["message"] = "Could not connect to database";
$response["database"] = [
  "status" => "disconnected",
  "errors" => $connectionErrors,
  "tried_hosts" => $dbHosts
];

http_response_code(500);
ob_end_clean();
echo json_encode($response, JSON_PRETTY_PRINT);
