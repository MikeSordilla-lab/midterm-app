<?php
require_once __DIR__ . '/config.php';

echo "Testing password hash...\n\n";

$username = "admin";
$password = "password123";

// Get the stored hash
$query = "SELECT password_hash FROM users WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo "User not found!\n";
  exit;
}

$user = $result->fetch_assoc();
$stored_hash = $user['password_hash'];

echo "Stored hash: " . $stored_hash . "\n";
echo "Test password: " . $password . "\n\n";

// Test the password
$isValid = password_verify($password, $stored_hash);
echo "Password verification result: " . ($isValid ? "VALID ✓" : "INVALID ✗") . "\n\n";

// Generate a new hash for comparison
$newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
echo "Newly generated hash: " . $newHash . "\n";
echo "Will verify: " . (password_verify($password, $newHash) ? "YES ✓" : "NO ✗") . "\n";

$stmt->close();
$conn->close();
