# Juego de la Serpiente

Juego de la serpiente (Snake) por turnos, hecho con **Vite + React + TypeScript**.
El tablero se dibuja como una tabla HTML de 8 filas por 8 columnas y la serpiente se
controla con las flechas del teclado: **cada pulsación de una flecha es un turno**.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm).

## Instalación

Desde la carpeta del proyecto (`2doParcial/JuegoSerpiente`):

```bash
npm install
```

## Ejecutar en modo desarrollo

```bash
npm run dev
```

Vite muestra en la consola una dirección como `http://localhost:5173/`.
Ábrela en el navegador. Importante: hay que abrirla con el servidor, no con doble clic
sobre `index.html`. Si las flechas no responden, haz clic una vez sobre el tablero para
darle el foco.

## Otros comandos

```bash
npm run build     # compila TypeScript y genera la versión de producción en dist/
npm run preview   # sirve localmente lo generado por npm run build
```

## Cómo se juega

- **Flechas ↑ ↓ ← →**: la cabeza avanza una celda en esa dirección y el cuerpo la sigue.
- Si la cabeza cae sobre la comida (celda roja), la serpiente crece un segmento y aparece
  comida nueva en una celda libre elegida al azar.
- Si la cabeza no come, el último segmento de la cola desaparece.
- **Botón Reiniciar**: vuelve a empezar la partida.

## Fin del juego (señal visual)

- **Borde rojo** en el tablero + mensaje de derrota: la cabeza salió del tablero o chocó
  contra su propio cuerpo. Ojo: dar la vuelta sobre sí misma también es un choque.
- **Borde verde** + mensaje de victoria: la serpiente ocupó todas las celdas del tablero
  (ya no queda ninguna casilla libre donde poner comida).

## Estructura del proyecto

```
src/
├── JuegoSerpiente.tsx   Todo el juego: estado, reglas, tablero y estilos
├── App.tsx              Muestra el componente del juego
├── App.css              Fondo claro de la página
├── index.css            Estilos generales de la página
└── main.tsx             Punto de entrada de React
```

## Cómo funciona el estado

- El tablero tiene 64 celdas y cada una se identifica con un número:
  `indice = fila * COLUMNAS + columna`.
- `serpiente` es una lista de esos números (`number[]`) donde la posición `0` es siempre
  la cabeza; el resto es el cuerpo.
- `comida` es un número o `null`, y `situacion` vale `'jugando'`, `'perdido'` o `'ganado'`.
- En cada turno se calcula la fila y la columna de la cabeza, se mueve una celda, se
  comprueba que no salga del tablero y que no choque con el cuerpo, y se arma la lista
  nueva: cada segmento toma el lugar del que tenía delante.
- El tablero que se dibuja se arma con `Array<marca>(64).fill('vacia').map(...)` a partir
  de ese estado, y las filas se generan con `[0,1,2,3,4,5,6,7].map(...)` y `slice`.

Todo está escrito con lo visto en clase: `useState` con tipos, `type` con uniones
(`'X' | 'O'` → `'cabeza' | 'cuerpo' | ...`), `Array<T>(n).fill(...)`, `map` con índice,
`slice`, ternarios, `<table>/<tbody>/<tr>/<td>` con `key`, `onClick`, y los estilos en un
objeto `{ [key: string]: CSSProperties }`, igual que en el tres en raya. Del enunciado del
examen se usan `onKeyDown` con `event.key`, `tabIndex` y
`Math.floor(Math.random() * elementos.length)`. No se usa ninguna librería externa.
