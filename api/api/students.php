<?php
include 'config.php';

// Add error logging for debugging
error_log("students.php called");
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("Connection status: " . ($conn ? "connected" : "not connected"));

try {
  // Handle different HTTP methods
  $method = $_SERVER['REQUEST_METHOD'];

  if ($method === 'GET') {
    // Verify connection
    if (!$conn) {
      error_log("No connection available");
      http_response_code(500);
      echo json_encode([
        "status" => "failed",
        "message" => "Database connection failed",
        "error" => "No database connection available"
      ]);
      exit;
    }

    // GET all students
    $sql = "SELECT id, firstname, lastname, ratings, last_update FROM student_list ORDER BY id DESC";
    error_log("Executing SQL: " . $sql);

    $result = $conn->query($sql);

    if (!$result) {
      error_log("Query error: " . $conn->error);
      http_response_code(500);
      echo json_encode([
        "status" => "failed",
        "message" => "Error fetching students",
        "error" => $conn->error,
        "query" => $sql
      ]);
      exit;
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }

    http_response_code(200);
    echo json_encode([
      "status" => "ok",
      "data" => $data,
      "count" => count($data)
    ]);
  } else {
    http_response_code(405);
    echo json_encode([
      "status" => "failed",
      "message" => "Method not allowed"
    ]);
  }
} catch (Exception $e) {
  error_log("Exception in students.php: " . $e->getMessage());
  http_response_code(500);
  echo json_encode([
    "status" => "failed",
    "message" => "Error: " . $e->getMessage(),
    "file" => $e->getFile(),
    "line" => $e->getLine()
  ]);
} finally {
  if ($conn) {
    $conn->close();
  }
}

ob_end_flush();
