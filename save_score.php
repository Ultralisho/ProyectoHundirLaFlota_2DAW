<?php
header('Content-Type: application/json; charset=utf-8');
$archivoScore = __DIR__ . '/scores.json';
$arrayMax = 10;

$jsonRecibido = file_get_contents('php://input');
if (!$jsonRecibido) {
    echo json_encode(['error' => 'Cuerpo vacío. Se esperaba JSON.']);
    exit;
}

$data = json_decode($jsonRecibido, true);
if (!is_array($data)) {
    echo json_encode(['error' => 'JSON inválido.']);
    exit;
}

$nombre = trim($data['nombre'] ?? '');
$disparos = (int)($data['disparos'] ?? 0);
if ($nombre === '') $nombre = 'Jugador';

$records = [];
if (file_exists($archivoScore)) {
    $json = file_get_contents($archivoScore);
    $records = json_decode($json, true) ?: [];
}

$records[] = ['nombre' => $nombre, 'disparos' => $disparos];
usort($records, fn($a, $b) => $a['disparos'] <=> $b['disparos']);
$records = array_slice($records, 0, $arrayMax);
file_put_contents($archivoScore, json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['status' => 'OK']);
?>
