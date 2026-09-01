import { useState, type CSSProperties, type KeyboardEvent } from "react";

type marca = 'cabeza' | 'cuerpo' | 'comida' | 'vacia';
type direccion = 'Arriba' | 'Abajo' | 'Izquierda' | 'Derecha';
type situacion = 'jugando' | 'perdido' | 'ganado';
type celda = number | null;

const FILAS = 8;
const COLUMNAS = 8;
const TOTAL = FILAS * COLUMNAS;

// Cada celda se identifica con un número: indice = fila * COLUMNAS + columna.
// La serpiente es una lista de esos números y la posición 0 siempre es la cabeza.
const serpienteInicial: number[] = [35, 34, 33];

// Devuelve un número al azar de una celda que no ocupe la serpiente.
const generarComida = (serpiente: number[]): celda => {
    const celdasLibres = Array<number>(TOTAL)
        .fill(0)
        .map((_valor, indice) => indice)
        .filter((indice) => serpiente.includes(indice) === false);

    if (celdasLibres.length === 0) {
        return null;
    }

    const indice = Math.floor(Math.random() * celdasLibres.length);
    return celdasLibres[indice];
};

const filaSiguiente = (fila: number, direccion: direccion): number => {
    if (direccion === 'Arriba') {
        return fila - 1;
    }
    if (direccion === 'Abajo') {
        return fila + 1;
    }
    return fila;
};

const columnaSiguiente = (columna: number, direccion: direccion): number => {
    if (direccion === 'Izquierda') {
        return columna - 1;
    }
    if (direccion === 'Derecha') {
        return columna + 1;
    }
    return columna;
};

export const JuegoSerpiente = () => {
    const [serpiente, setSerpiente] = useState<number[]>(serpienteInicial);
    const [comida, setComida] = useState<celda>(generarComida(serpienteInicial));
    const [situacion, setSituacion] = useState<situacion>('jugando');
    const [turnos, setTurnos] = useState<number>(0);

    // El tablero se arma a partir del estado: una lista de 64 marcas.
    const tablero: marca[] = Array<marca>(TOTAL)
        .fill('vacia')
        .map((_valor, indice) => {
            if (indice === serpiente[0]) {
                return 'cabeza';
            }
            if (serpiente.includes(indice)) {
                return 'cuerpo';
            }
            if (indice === comida) {
                return 'comida';
            }
            return 'vacia';
        });

    // Un turno: la cabeza avanza una celda y el cuerpo la sigue.
    const avanzarTurno = (direccion: direccion): void => {
        const cabeza = serpiente[0];
        const fila = Math.floor(cabeza / COLUMNAS);
        const columna = cabeza % COLUMNAS;

        const nuevaFila = filaSiguiente(fila, direccion);
        const nuevaColumna = columnaSiguiente(columna, direccion);

        // Si la cabeza sale del tablero, el juego termina.
        if (nuevaFila < 0 || nuevaFila >= FILAS) {
            setSituacion('perdido');
            return;
        }
        if (nuevaColumna < 0 || nuevaColumna >= COLUMNAS) {
            setSituacion('perdido');
            return;
        }

        const nuevaCabeza = nuevaFila * COLUMNAS + nuevaColumna;
        const come = nuevaCabeza === comida;

        // Si come, la serpiente mide un segmento más; si no, mide lo mismo
        // porque el último segmento (la cola) desaparece.
        const largo = come ? serpiente.length + 1 : serpiente.length;

        // Segmentos que seguirán ocupados después de mover la cabeza.
        const cuerpoRestante = serpiente.slice(0, largo - 1);

        // Si la cabeza cae sobre su propio cuerpo, el juego termina.
        if (cuerpoRestante.includes(nuevaCabeza)) {
            setSituacion('perdido');
            return;
        }

        // Cada segmento toma el lugar del segmento que tenía delante.
        const nuevaSerpiente = Array<number>(largo)
            .fill(0)
            .map((_valor, posicion) => {
                return posicion === 0 ? nuevaCabeza : serpiente[posicion - 1];
            });

        setSerpiente(nuevaSerpiente);
        setTurnos(turnos + 1);

        if (come) {
            const nuevaComida = generarComida(nuevaSerpiente);
            setComida(nuevaComida);
            if (nuevaComida === null) {
                // Ya no queda ninguna celda libre: la serpiente llenó el tablero.
                setSituacion('ganado');
            }
        }
    };

    const manejarTecla = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (situacion !== 'jugando') {
            return;
        }
        if (event.key === 'ArrowUp') {
            avanzarTurno('Arriba');
        } else if (event.key === 'ArrowDown') {
            avanzarTurno('Abajo');
        } else if (event.key === 'ArrowLeft') {
            avanzarTurno('Izquierda');
        } else if (event.key === 'ArrowRight') {
            avanzarTurno('Derecha');
        }
    };

    const reiniciar = (): void => {
        setSerpiente(serpienteInicial);
        setComida(generarComida(serpienteInicial));
        setSituacion('jugando');
        setTurnos(0);
    };

    // El borde de la tabla es la señal visual del final del juego.
    const estiloDeLaTabla = (): CSSProperties => {
        if (situacion === 'perdido') {
            return styles.tablaPerdido;
        }
        if (situacion === 'ganado') {
            return styles.tablaGanado;
        }
        return styles.tabla;
    };

    const estiloDeLaCelda = (marca: marca): CSSProperties => {
        if (marca === 'cabeza') {
            return styles.celdaCabeza;
        }
        if (marca === 'cuerpo') {
            return styles.celdaCuerpo;
        }
        if (marca === 'comida') {
            return styles.celdaComida;
        }
        return styles.celda;
    };

    const mensaje = (): string => {
        if (situacion === 'perdido') {
            return '¡Perdiste! Chocaste con el borde o con tu propio cuerpo.';
        }
        if (situacion === 'ganado') {
            return '¡Ganaste! La serpiente llenó todo el tablero.';
        }
        return 'Turno ' + turnos + ' - Longitud ' + serpiente.length;
    };

    const estiloDelMensaje = (): CSSProperties => {
        if (situacion === 'perdido') {
            return styles.mensajePerdido;
        }
        if (situacion === 'ganado') {
            return styles.mensajeGanado;
        }
        return styles.mensaje;
    };

    return (
        <div style={styles.container} tabIndex={0} onKeyDown={manejarTecla} autoFocus>
            <h2 style={styles.titulo}>Juego de la Serpiente</h2>
            <p style={estiloDelMensaje()}>{mensaje()}</p>

            <table style={estiloDeLaTabla()}>
                <tbody>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((fila) => {
                        return (
                            <tr key={fila}>
                                {tablero
                                    .slice(fila * COLUMNAS, fila * COLUMNAS + COLUMNAS)
                                    .map((marca, columna) => {
                                        return <td key={columna} style={estiloDeLaCelda(marca)}></td>;
                                    })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <button style={styles.boton} onClick={reiniciar}>
                Reiniciar
            </button>
            <p style={styles.ayuda}>
                Mueve la serpiente con las flechas del teclado. Cada flecha es un turno.
                Si no responde, haz clic sobre el tablero.
            </p>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30px',
        outline: 'none',
    },
    titulo: {
        marginBottom: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2933',
    },
    mensaje: {
        marginBottom: '20px',
        fontSize: '16px',
        color: '#52606d',
    },
    mensajePerdido: {
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#c62828',
    },
    mensajeGanado: {
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    tabla: {
        borderCollapse: 'collapse',
        margin: '0 auto',
        border: '6px solid #9aa5b1',
        backgroundColor: '#ffffff',
    },
    tablaPerdido: {
        borderCollapse: 'collapse',
        margin: '0 auto',
        border: '6px solid #c62828',
        backgroundColor: '#ffffff',
    },
    tablaGanado: {
        borderCollapse: 'collapse',
        margin: '0 auto',
        border: '6px solid #2e7d32',
        backgroundColor: '#ffffff',
    },
    celda: {
        width: '44px',
        height: '44px',
        border: '1px solid #d9e2ec',
        backgroundColor: '#ffffff',
    },
    celdaCabeza: {
        width: '44px',
        height: '44px',
        border: '3px solid #a5d6a7',
        backgroundColor: '#2e7d32',
    },
    celdaCuerpo: {
        width: '44px',
        height: '44px',
        border: '1px solid #d9e2ec',
        backgroundColor: '#81c784',
    },
    celdaComida: {
        width: '44px',
        height: '44px',
        border: '1px solid #d9e2ec',
        backgroundColor: '#c62828',
    },
    boton: {
        marginTop: '20px',
        fontSize: '16px',
        padding: '8px 20px',
        color: '#ffffff',
        backgroundColor: '#2e7d32',
        border: 'none',
        cursor: 'pointer',
    },
    ayuda: {
        marginTop: '12px',
        fontSize: '14px',
        color: '#52606d',
    },
};
