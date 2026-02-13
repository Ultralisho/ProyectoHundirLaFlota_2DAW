let juego = {
  flota: [],
  disparos: 0,
  finalizado: false,
};

fetch("start_game.php")
  .then((r) => r.json())
  .then((data) => {
    if (!data || !data.flota) {
      console.error("No se recibió una flota válida:", data);
      return;
    }
    juego.flota = data.flota.map((barco) => ({
      nombre: barco.nombre,
      tamaño: barco.tamaño,
      coordenadas: barco.coordenadas,
      aciertos: 0,
      hundido: false,
    }));
    creartablero();
    cargarPuntuaciones();
  })
  .catch((error) => console.error("Error cargando datos del juego:", error));

function creartablero() {
  const contenedor = document.querySelector(".Principal");
  const previo = document.querySelector(".tablero");
  if (previo) previo.remove();

  const tablero = document.createElement("div");
  tablero.classList.add("tablero");

  for (let i = 0; i < 100; i++) {
    const celda = document.createElement("div");
    celda.classList.add("celda");
    celda.dataset.fila = Math.floor(i / 10);
    celda.dataset.columna = i % 10;
    celda.addEventListener("click", manejarClickCelda);
    tablero.appendChild(celda);
  }

  contenedor.appendChild(tablero);
  mostrarMensaje("Dispara para comenzar!");
}

function manejarClickCelda(e) {
  if (juego.finalizado) return;

  const celda = e.target;
  const fila = parseInt(celda.dataset.fila);
  const columna = parseInt(celda.dataset.columna);

  if (
    celda.classList.contains("agua") ||
    celda.classList.contains("tocado") ||
    celda.classList.contains("hundido")
  )
    return;

  juego.disparos++;
  let acierto = false;

  for (const barco of juego.flota) {
    for (const pos of barco.coordenadas) {
      if (pos.fila === fila && pos.col === columna) {
        acierto = true;
        barco.aciertos++;
        celda.classList.add("tocado");

        if (barco.aciertos === barco.tamaño) {
          barco.hundido = true;
          barco.coordenadas.forEach((p) => {
            const index = p.fila * 10 + p.col;
            document
              .querySelectorAll(".celda")[index]
              .classList.remove("tocado");
            document
              .querySelectorAll(".celda")[index]
              .classList.add("hundido");
          });
          mostrarMensaje(`Hundiste el ${barco.nombre}!`);
        } else {
          mostrarMensaje("Tocado!");
        }
      }
    }
  }

  if (!acierto) {
    celda.classList.add("agua");
    mostrarMensaje("Agua");
  }

  if (juego.flota.every((b) => b.hundido)) {
    juego.finalizado = true;
    mostrarMensaje(`Has ganado con ${juego.disparos} disparos!`);
    pedirNombreYGuardar();
  }
}

function mostrarMensaje(texto) {
  const p = document.querySelector(".Principal p");
  if (p) p.textContent = texto;
}

function pedirNombreYGuardar() {
  let nombre = prompt("¡Has ganado! Escribe tu nombre para guardar tu puntuación:");
  if (!nombre || nombre.trim() === "") nombre = "Jugador";
  guardarPuntuacion(nombre.trim(), juego.disparos);
}

function guardarPuntuacion(nombre, disparos) {
  fetch("save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, disparos }),
  })
    .then((r) => r.json())
    .then(() => cargarPuntuaciones())
    .catch((error) => console.error("Error al guardar puntuación:", error));
}

function cargarPuntuaciones() {
  fetch("get_scores.php")
    .then((r) => r.json())
    .then((data) => {
      const lista = document.querySelector(".ranking");
      lista.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay puntuaciones aún.";
        lista.appendChild(li);
        return;
      }

      data.forEach((record) => {
        const li = document.createElement("li");
        li.textContent = `${record.nombre}: ${record.disparos} disparos`;
        lista.appendChild(li);
      });
    })
    .catch((error) => console.error("Error al cargar puntuaciones:", error));
}
