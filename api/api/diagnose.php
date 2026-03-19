<?php

/**
 * Comprehensive Diagnostic Tool for Midterm API
 * Tests database, API endpoints, CORS, and network connectivity
 */

// Set error handling FIRST
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok']));
}

$diagnostics = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [],
    'database' => [],
    'endpoints' => [],
    'network' => [],
    'recommendations' => [],
    'status' => 'ok'
];

// 1. Server Information
$diagnostics['server_info'] = [
    'php_version' => phpversion(),
    'os' => php_uname(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'api_url' => (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
];

// 2. Database Connectivity - Direct approach without config.php dependencies
$db_config = [
    'host' => 'localhost',
    'port' => '3307',
    'user' => 'root',
    'pass' => '',
    'name' => 'student_db'
];

$diagnostics['database']['attempting'] = "{$db_config['user']}@{$db_config['host']}:{$db_config['port']}/{$db_config['name']}";

try {
    $dsn = "mysql:host={$db_config['host']};port={$db_config['port']};dbname={$db_config['name']}";
    $pdo = new PDO(
        $dsn,
        $db_config['user'],
        $db_config['pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5
        ]
    );

    $diagnostics['database']['status'] = 'connected';
    $diagnostics['database']['host'] = $db_config['host'];
    $diagnostics['database']['port'] = $db_config['port'];
    $diagnostics['database']['database'] = $db_config['name'];

    // Check if student_list table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'student_list'");
    $diagnostics['database']['student_list_table_exists'] = $stmt->rowCount() > 0;

    // Check row count
    if ($diagnostics['database']['student_list_table_exists']) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM student_list");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $diagnostics['database']['student_count'] = (int)$result['count'];
    } else {
        $diagnostics['recommendations'][] = "student_list table not found - run setup.php to create it";
        $diagnostics['status'] = 'warning';
    }
} catch (PDOException $e) {
    $diagnostics['database']['status'] = 'failed';
    $diagnostics['database']['error'] = $e->getMessage();
    $diagnostics['recommendations'][] = "Database Connection Failed: " . $e->getMessage();
    $diagnostics['status'] = 'error';
} catch (Exception $e) {
    $diagnostics['database']['status'] = 'failed';
    $diagnostics['database']['error'] = $e->getMessage();
    $diagnostics['recommendations'][] = "Unexpected Error: " . $e->getMessage();
    $diagnostics['status'] = 'error';
}

// 3. Test Endpoints
$endpoints_to_test = [
    'students' => 'students.php',
    'debug_students' => 'debug-students.php',
    'test' => 'test.php',
];

foreach ($endpoints_to_test as $name => $endpoint) {
    $file_path = __DIR__ . '/' . $endpoint;
    $diagnostics['endpoints'][$name] = [
        'file_exists' => file_exists($file_path),
        'readable' => is_readable($file_path),
        'writable' => is_writable($file_path),
    ];
}

// 4. Network/CORS Information
$diagnostics['network'] = [
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'http_host' => $_SERVER['HTTP_HOST'] ?? 'Unknown',
    'origin_header' => $_SERVER['HTTP_ORIGIN'] ?? 'None',
    'cors_headers_sent' => true,
];

// 5. Generate Recommendations
if (!isset($pdo) || $diagnostics['database']['status'] === 'failed') {
    $diagnostics['recommendations'][] = "CRITICAL: Database is not accessible. Check MySQL is running and credentials in config.php are correct.";
}

if (empty($diagnostics['database']['student_count'])) {
    $diagnostics['recommendations'][] = "WARNING: No students in database. Use create_student.php to add test data.";
}

if (!empty($diagnostics['recommendations'])) {
    $diagnostics['warnings'] = count($diagnostics['recommendations']);
} else {
    $diagnostics['status'] = 'ok';
    $diagnostics['message'] = 'All systems operational';
}

http_response_code(200);
echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
