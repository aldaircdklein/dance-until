/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

const Player = () => {
    const [navbar, setNavbar] = useState(true);
    const [scanned, setScanned] = useState(false);
    const [gamerOuver, setGamerOuver] = useState(false);
    const [gamerOuver3, setGamerOuver3] = useState(false);
    let gameOuver2 = false;
    const [pause, setPause] = useState(true);
    const [username, setUsername] = useState('');
    const [victory, setVictory] = useState(false);
    const gyroscope = new Gyroscope({frequency: 60});

    const handleSocket = (url) => {
        console.log(url);
        const socket = socketIOClient(`http://${url}`);
        console.log('entrei')
        socket.emit('players', {username});
        socket.on("newStatus", (req) => {
        console.log(req.data.status);
        setPause(!req.data.status);
        handleSensors(req.data.status, req.data.init);
        })
        socket.on("newFinish", (req) => {
        console.log(req.data.status);
        socket.emit('result', {status:!gameOuver2, username})
        handleFinish(req.data.status);
        })
        socket.on("newReload", () => {
        reload();
        setTimeout(() => {
            socket.emit('players', {username});
        }, 5000)
        })
    }

    const handleFinish = (state) => {
        if(state){
        setVictory(!gamerOuver);
        //Accelerometer.removeAllListeners();
        setGamerOuver3(gameOuver2);
        }
    }

    const handleSensors = (state, init) => {
        if(init){
        setTimeout(() => {
            gyroscope.addEventListener('reading', e => {
                const x = (gyroscope.x).toFixed(2)
                const y = (gyroscope.y).toFixed(2)
                const z = (gyroscope.z).toFixed(2) 
                if(x > 2 || y > 2 || z > 2){
                    if(state){
                        if(x == 0.00 || y == 0.00 || z == 0.00){
                            console.log('para dançar')
                            setGamerOuver(true);
                            gameOuver2 = true;
                        }
                    }else{
                        if(x > 2 || y > 2 || z > 2){
                        console.log('para parar')
                        setGamerOuver(true);
                        gameOuver2 = true;
                        }
                    }
                }
            });
            gyroscope.start();
            /* Accelerometer.removeAllListeners();
            Accelerometer.addListener('reading', accelerometerData => {
                console.log(accelerometerData)
                const x = Math.abs(Math.trunc(accelerometerData.x * 100) / 100);
                const y = Math.abs(Math.trunc(accelerometerData.y * 100) / 100);
                const z = Math.abs(Math.trunc(accelerometerData.z * 100) / 100);
                if(state){
                    if(x == 0.99 || y == 0.99 || z == 0.99){
                    if(x == 0.0 && y == 0.0 || y == 0.0 && z == 0.0 || z == 0.0 && x == 0.0){
                        console.log('para dançar')
                        setGamerOuver(true);
                        gameOuver2 = true;
                    }
                    }
                }else{
                    if(x > 1 || y > 1 || z > 1){
                    console.log('para parar')
                    setGamerOuver(true);
                    gameOuver2 = true;
                    }
                }
            })
            Accelerometer.start(); */
        }, 1000)
        }
    }

    const reload = () => {
        setGamerOuver(false);
        setGamerOuver3(false);
        gameOuver2 = false;
        setPause(true);
        setVictory(false);
    }

    useEffect(() => {
        (async () => {
            await navigator.permissions.query({name:'gyroscope'})
        })();
    }, []);

    const handleInit = () => {
        handleSocket('192.168.0.120:3003');
        setNavbar(false)
    };

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center bg-slate-700'>
        {
            navbar && (
            <>
                <img src='./assets/logo.png' className='w-20 h-20' />
                <h1 className='text-white text-2xl'>Dance Until</h1>
                <input
                    placeholder='Nome de jogador'
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}}
                    className="text-yellow-400 text-lg mt-8 mb-8 text-center"
                />
                <button type='button' onClick={() => {handleInit()}}>
                    Iniciar
                </button>
            </>
            )
        }
        {
            pause && scanned && !gamerOuver && !victory &&(
            <img src='./assets/bg.jpg' className='w-screen h-screen' />
            )
        }
        {
            !pause && scanned && !gamerOuver && !victory &&(
            <img src='./assets/luz.gif' className='w-screen h-screen' />
            )
        }
        {
            !victory && gamerOuver3 || gamerOuver && (
            <>
                <img src='./assets/gameouver.jpg' className='w-screen h-screen' />
                <p className='absolute text-white text-lg'>Você perdeu!</p>
            </>
            )
        }
        {
            victory && !gamerOuver && (
            <>
                <img src='./assets/victory.jpg' className='w-screen h-screen' />
                <p className='absolute text-white text-lg'>Você dança muitooooooo!</p>
            </>
            )
        }
        </div>
    )
}

export default Player;