<?php
include 'config.php';

$response_code = 400;
$response = null;

try {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response_code = 405;
    $response = [
      "status" => "failed",
      "message" => "Method not allowed"
    ];
  } else {
    // Get input from POST request - handle both form data and JSON
    $firstname = '';
    $lastname = '';
    $ratings = 0;

    // Try to parse JSON input first
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($contentType, 'application/json') !== false) {
      $input = json_decode(file_get_contents('php://input'), true);
      if (is_array($input)) {
        $firstname = isset($input['firstname']) ? trim($input['firstname']) : '';
        $lastname = isset($input['lastname']) ? trim($input['lastname']) : '';
        $ratings = isset($input['ratings']) ? intval($input['ratings']) : 0;
      }
    } else {
      // Fall back to form data
      $firstname = isset($_POST['firstname']) ? trim($_POST['firstname']) : '';
      $lastname = isset($_POST['lastname']) ? trim($_POST['lastname']) : '';
      $ratings = isset($_POST['ratings']) ? intval($_POST['ratings']) : 0;
    }

    // Validation
    if (empty($firstname) || empty($lastname)) {
      $response_code = 400;
      $response = [
        "status" => "failed",
        "message" => "First name and last name are required"
      ];
    } elseif ($ratings < 0 || $ratings > 100) {
      $response_code = 400;
      $response = [
        "status" => "failed",
        "message" => "Rating must be between 0 and 100"
      ];
    } elseif (strlen($firstname) > 50 || strlen($lastname) > 50) {
      $response_code = 400;
      $response = [
        "status" => "failed",
        "message" => "Name must be 50 characters or less"
      ];
    } else {
      // Use prepared statement for security
      $sql = "INSERT INTO student_list (firstname, lastname, ratings, last_update) VALUES (?, ?, ?, NOW())";
      $stmt = $conn->prepare($sql);

      if (!$stmt) {
        $response_code = 500;
        $response = [
          "status" => "failed",
          "message" => "Database error: " . $conn->error
        ];
      } else {
        $stmt->bind_param("ssi", $firstname, $lastname, $ratings);

        if ($stmt->execute()) {
          $response_code = 201;
          $response = [
            "status" => "ok",
            "message" => "Student created successfully",
            "id" => $stmt->insert_id
          ];
        } else {
          $response_code = 500;
          $response = [
            "status" => "failed",
            "message" => "Error creating student: " . $stmt->error
          ];
        }

        $stmt->close();
      }
    }

    $conn->close();
  }
} catch (Exception $e) {
  $response_code = 500;
  $response = [
    "status" => "failed",
    "message" => "Error: " . $e->getMessage()
  ];
}

http_response_code($response_code);
echo json_encode($response);
ob_end_flush();
