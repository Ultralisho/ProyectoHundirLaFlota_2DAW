<?php
header('Content-Type: application/json; charset=utf-8');

$flota = [
    'Portaaviones' => 5,
    'Acorazado' => 4,
    'Destructor' => 3,
    'Submarino' => 3,
    'Patrullero' => 2
];

$tamanoTablero = 10;
$tablero = array_fill(0, $tamanoTablero, array_fill(0, $tamanoTablero, 0));
$posicionesFlota = [];

foreach ($flota as $barco => $tamano) {
    do {
        $orientacion = random_int(0, 1);
        $ok = true;
        if ($orientacion === 0) {
            $fila = random_int(0, $tamanoTablero - 1);
            $colIni = random_int(0, $tamanoTablero - $tamano - 1);
            $coordenadas = [];
            for ($columna = $colIni; $columna < $colIni + $tamano; $columna++) {
                if ($tablero[$fila][$columna] === 1) { $ok = false; break; }
                $coordenadas[] = ['fila' => $fila, 'col' => $columna];
            }
        } else {
            $filaIni = random_int(0, $tamanoTablero - $tamano - 1);
            $columna = random_int(0, $tamanoTablero - 1);
            $coordenadas = [];
            for ($fila = $filaIni; $fila < $filaIni + $tamano; $fila++) {
                if ($tablero[$fila][$columna] === 1) { $ok = false; break; }
                $coordenadas[] = ['fila' => $fila, 'col' => $columna];
            }
        }
    } while (!$ok);

    foreach ($coordenadas as $posicion) {
        $tablero[$posicion['fila']][$posicion['col']] = 1;
    }

    $posicionesFlota[] = [
        'nombre' => $barco,
        'tamaño' => $tamano,
        'coordenadas' => $coordenadas
    ];
}

echo json_encode(['flota' => $posicionesFlota], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
