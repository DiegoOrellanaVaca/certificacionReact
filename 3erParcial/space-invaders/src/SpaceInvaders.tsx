import { useEffect, useState } from "react";

type Block = {
    x: number,
    y: number,
}

function SpaceInvaders() {
    const BLOCK_SIZE = 5

    //Control de Ventana
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [windowHeigth, setWindowHeigth] = useState<number>(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
            setWindowHeigth(window.innerHeight)
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //Bulletproof pero sin el proof pq solo es una bala
    const [bulletLeft, setBulletLeft] = useState(windowWidth / 2)
    const [bulletBottom, setBulletBottom] = useState(BLOCK_SIZE)

    useEffect(() => {
        setBulletLeft(windowWidth / 2)
    }, [windowWidth])

    const moveBullet = () => {
        setBulletBottom((prev) => prev + BLOCK_SIZE)
    }

    //No bulletproof pq es un alien acci acci dente el accidente
    const [aliens, setAliens] = useState<Array<Block>>([]);

    const moveAliens = () => {
        const newAliens = [...aliens]
        newAliens.forEach((alien) => {
            alien.y = alien.y >= 60 ? 0 : alien.y + BLOCK_SIZE
            alien.x = alien.x + (Math.floor(Math.random() * 3) - 1) * BLOCK_SIZE
        })
        setAliens(newAliens)
    }

    const generateAlien = () => {
        if (aliens.length >= 5) return
        let posX = (Math.floor(Math.random() * 10) + 5) * 5
        aliens.push({ x: posX, y: 0 })
    }

    // Ticks (tocks waaaaj)
    const onTickDo = () => {
        moveBullet()
        moveAliens()
        generateAlien()
    }

    useEffect(() => {
        const tick: number = setInterval(() => {
            onTickDo()
        }, 1000)

        return () => clearInterval(tick)
    }, [])

    return (
        <>
            <div className="arma">
                Soy una base
            </div>
            <div style={{
                position: 'absolute',
                width: '5rem',
                height: '5rem',
                left: `${bulletLeft}px`,
                bottom: `${bulletBottom}rem`,
                transform: 'translateX(-50%)',
                background: 'red'
            }}>
                Soy un cuadrado
            </div>
            {aliens.map((alien) => (
                <div
                    style={{
                        position: 'absolute',
                        width: '5rem',
                        height: '5rem',
                        left: `${alien.x}rem`,
                        top: `${alien.y}rem`,
                        transform: 'translateX(-50%)',
                        background: 'green'
                    }}
                >
                    x:{alien.x}, y:{alien.y}
                </div>
            ))}
        </>
    );
}

export default SpaceInvaders;