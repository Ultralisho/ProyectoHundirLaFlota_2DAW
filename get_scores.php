<?php
header('Content-Type: application/json; charset=utf-8');
$archivoScore = __DIR__ . '/scores.json';

try {
    if (!file_exists($archivoScore)) {
        echo json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }
    $contenidoJson = file_get_contents($archivoScore);
    $record = json_decode($contenidoJson, true);
    if ($record === null && json_last_error() !== JSON_ERROR_NONE) $record = [];
    echo json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al leer puntuaciones', 'message' => $e->getMessage()]);
}
?>
