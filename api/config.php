<?php
// Configurações de email para teste
ini_set('SMTP', 'localhost');
ini_set('smtp_port', 25);
ini_set('sendmail_from', 'test@localhost');

// Configurações de debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Função para log
function logError($message) {
    $logFile = __DIR__ . '/error.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}
