<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError('Method not allowed: ' . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
logError('Received data: ' . $input);

$data = json_decode($input, true);

if (!$data) {
    logError('Invalid JSON data');
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit;
}

$name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$message = filter_var($data['message'] ?? '', FILTER_SANITIZE_STRING);

if (!$name || !$email || !$message) {
    logError('Missing required fields');
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logError('Invalid email: ' . $email);
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

$to = 'contato@melhorgestao.com.br';
$subject = 'Novo contato do site - Melhor Gestão';
$headers = [
    'From' => $email,
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/html; charset=UTF-8'
];

$emailBody = "
<html>
<head>
    <title>Novo contato - Melhor Gestão</title>
</head>
<body>
    <h2>Novo contato recebido pelo site</h2>
    <p><strong>Nome:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Mensagem:</strong></p>
    <p>{$message}</p>
</body>
</html>
";

logError("New contact form submission:\nName: $name\nEmail: $email\nMessage: $message");

$success = mail($to, $subject, $emailBody, $headers);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    logError('Failed to send message');
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message']);
}
