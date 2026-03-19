<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$logFile = __DIR__ . '/../api_errors.log';

if (!file_exists($logFile)) {
  http_response_code(200);
  echo json_encode([
    "status" => "ok",
    "message" => "No errors logged yet",
    "log_file" => $logFile
  ]);
  exit;
}

$logContent = file_get_contents($logFile);
$lines = explode("\n", $logContent);
$lines = array_filter($lines); // Remove empty lines
$lines = array_slice($lines, -50); // Get last 50 lines

http_response_code(200);
echo json_encode([
  "status" => "ok",
  "message" => "Recent error logs",
  "log_file" => $logFile,
  "line_count" => count($lines),
  "logs" => $lines
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
