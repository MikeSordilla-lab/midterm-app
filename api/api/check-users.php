<?php
require_once __DIR__ . '/config.php';

echo "Checking users in database...\n\n";

$query = "SELECT id, username, email, first_name, last_name, is_active FROM users";
$result = $conn->query($query);

if (!$result) {
  echo "Query error: " . $conn->error . "\n";
  exit;
}

echo "Users found: " . $result->num_rows . "\n\n";

if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    echo "ID: " . $row['id'] . "\n";
    echo "Username: " . $row['username'] . "\n";
    echo "Email: " . $row['email'] . "\n";
    echo "Name: " . $row['first_name'] . " " . $row['last_name'] . "\n";
    echo "Active: " . ($row['is_active'] ? 'Yes' : 'No') . "\n";
    echo "---\n";
  }
} else {
  echo "No users found!\n";
}

$conn->close();
