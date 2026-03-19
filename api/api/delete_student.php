<?php
include 'config.php';

// Add error logging for debugging
error_log("delete_student.php called");
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("Connection status: " . ($conn ? "connected" : "not connected"));

try {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
      "status" => "failed",
      "message" => "Method not allowed"
    ]);
    ob_end_flush();
    exit;
  }

  // Get input from POST request - handle both form data and JSON
  $id = 0;

  // Try to parse JSON input first
  $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
  if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) {
      $id = isset($input['id']) ? intval($input['id']) : 0;
    }
  } else {
    // Fall back to form data
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
  }

  error_log("Delete student ID: " . $id);

  // Validation
  if ($id <= 0) {
    error_log("Invalid student ID: " . $id);
    http_response_code(400);
    echo json_encode([
      "status" => "failed",
      "message" => "Valid student ID is required"
    ]);
    ob_end_flush();
    exit;
  }

  // Check if student exists without relying on mysqlnd/get_result()
  $check_sql = "SELECT id FROM student_list WHERE id = ?";
  $check_stmt = $conn->prepare($check_sql);

  if (!$check_stmt) {
    error_log("Prepare error: " . $conn->error);
    http_response_code(500);
    echo json_encode([
      "status" => "failed",
      "message" => "Database error: " . $conn->error
    ]);
    ob_end_flush();
    exit;
  }

  $check_stmt->bind_param("i", $id);
  $check_stmt->execute();
  $check_stmt->store_result();

  if ($check_stmt->num_rows === 0) {
    error_log("Student not found with ID: " . $id);
    http_response_code(404);
    echo json_encode([
      "status" => "failed",
      "message" => "Student not found"
    ]);
    $check_stmt->close();
    ob_end_flush();
    exit;
  }
  $check_stmt->close();

  // Use prepared statement for security
  $sql = "DELETE FROM student_list WHERE id = ?";
  $stmt = $conn->prepare($sql);

  if (!$stmt) {
    error_log("Delete prepare error: " . $conn->error);
    http_response_code(500);
    echo json_encode([
      "status" => "failed",
      "message" => "Database error: " . $conn->error
    ]);
    ob_end_flush();
    exit;
  }

  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    error_log("Student deleted successfully: " . $id);
    http_response_code(200);
    echo json_encode([
      "status" => "ok",
      "message" => "Student deleted successfully",
      "id" => $id
    ]);
  } else {
    error_log("Delete execute error: " . $stmt->error);
    http_response_code(500);
    echo json_encode([
      "status" => "failed",
      "message" => "Error deleting student: " . $stmt->error
    ]);
  }

  $stmt->close();
  $conn->close();
  ob_end_flush();
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    "status" => "failed",
    "message" => "Error: " . $e->getMessage()
  ]);
  ob_end_flush();
}
