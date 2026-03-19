<?php
include 'config.php';

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
  $firstname = '';
  $lastname = '';
  $ratings = 0;

  // Try to parse JSON input first
  $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
  if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) {
      $id = isset($input['id']) ? intval($input['id']) : 0;
      $firstname = isset($input['firstname']) ? trim($input['firstname']) : '';
      $lastname = isset($input['lastname']) ? trim($input['lastname']) : '';
      $ratings = isset($input['ratings']) ? intval($input['ratings']) : 0;
    }
  } else {
    // Fall back to form data
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $firstname = isset($_POST['firstname']) ? trim($_POST['firstname']) : '';
    $lastname = isset($_POST['lastname']) ? trim($_POST['lastname']) : '';
    $ratings = isset($_POST['ratings']) ? intval($_POST['ratings']) : 0;
  }

  // Validation
  if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
      "status" => "failed",
      "message" => "Valid student ID is required"
    ]);
    ob_end_flush();
    exit;
  }

  if (empty($firstname) || empty($lastname)) {
    http_response_code(400);
    echo json_encode([
      "status" => "failed",
      "message" => "First name and last name are required"
    ]);
    ob_end_flush();
    exit;
  }

  if ($ratings < 0 || $ratings > 100) {
    http_response_code(400);
    echo json_encode([
      "status" => "failed",
      "message" => "Rating must be between 0 and 100"
    ]);
    ob_end_flush();
    exit;
  }

  if (strlen($firstname) > 50 || strlen($lastname) > 50) {
    http_response_code(400);
    echo json_encode([
      "status" => "failed",
      "message" => "Name must be 50 characters or less"
    ]);
    ob_end_flush();
    exit;
  }

  // Check if student exists
  $check_sql = "SELECT id FROM student_list WHERE id = ?";
  $check_stmt = $conn->prepare($check_sql);
  $check_stmt->bind_param("i", $id);
  $check_stmt->execute();
  $check_result = $check_stmt->get_result();

  if ($check_result->num_rows === 0) {
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
  $sql = "UPDATE student_list SET firstname=?, lastname=?, ratings=?, last_update=NOW() WHERE id=?";
  $stmt = $conn->prepare($sql);

  if (!$stmt) {
    http_response_code(500);
    echo json_encode([
      "status" => "failed",
      "message" => "Database error: " . $conn->error
    ]);
    ob_end_flush();
    exit;
  }

  $stmt->bind_param("ssii", $firstname, $lastname, $ratings, $id);

  if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode([
      "status" => "ok",
      "message" => "Student updated successfully"
    ]);
  } else {
    http_response_code(500);
    echo json_encode([
      "status" => "failed",
      "message" => "Error updating student: " . $stmt->error
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
