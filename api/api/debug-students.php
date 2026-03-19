<?php
include 'config.php';

$sql = "SELECT id, firstname, lastname, ratings, last_update FROM student_list ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) {
  http_response_code(500);
  die(json_encode([
    "status" => "failed",
    "message" => "Query error: " . $conn->error
  ]));
}

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

http_response_code(200);
echo json_encode([
  "status" => "ok",
  "connected_host" => $connectedHost,
  "data" => $data,
  "count" => count($data)
]);

$result->free();
$conn->close();
?>
