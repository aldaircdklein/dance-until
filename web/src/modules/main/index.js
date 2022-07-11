import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import QRCode from "react-qr-code";
import axios from "axios";
import {GiMusicalNotes} from 'react-icons/gi';
import {BsPlayFill} from 'react-icons/bs';
import {IoReloadOutline} from 'react-icons/io5';
const api = axios.create({baseURL: "http://localhost:3003",});
const socket = socketIOClient("http://localhost:3003/");

const Main = () => {
  const [navbar, setNavbar] = useState(true);
  const music = new Audio('./music/music.mp3');
  const stopMusic = new Audio('./music/music2.mp3');
  const [duration, setDuration] = useState(1);
  const [ip, setIp] = useState('');
  const [pause, setPause] = useState(true);
  const [players, setPlayers] = useState([]);
  const [playersVictory, setPlayersVictory] = useState([]);
  const [playersGameOuver, setPlayersGameOuver] = useState([]);
  const [victory, setVictory] = useState(false);

  const handleIp = async () => {
    const result = await api.get('ip');
    setIp(result.data.address);
    socket.on('newPlayers', (res) => {
      if(!players.includes(res.data.username)){
        const list = players;
        list.unshift(res.data.username);
        setPlayers(Array.from(list));
      }
    })
  }

  const handleSocket = () => {
    socket.emit('status', {status:true, init:true});
    const interval = setInterval(() => {
      const random = Math.random() > 0.5 ? true : false
      socket.emit('status', {status:random, init:true});
      console.log(random);
      setPause(random);
      handleMusic(random);
    }, 25000)
    setTimeout(() => {
      socket.emit('finish', {status:true});
      socket.on('newResult', (res) => {
        if(res.data.status){
          if(!playersVictory.includes(res.data.username)){
            const list = playersVictory;
            list.unshift(res.data.username);
            setPlayersVictory(Array.from(list));
          }
        }else{
          if(!playersGameOuver.includes(res.data.username)){
            const list = playersGameOuver;
            list.unshift(res.data.username);
            setPlayersGameOuver(Array.from(list));
          }
        }
      })
      clearInterval(interval);
      setTimeout(() => {
        music.pause();
        stopMusic.pause();
        const victoryMusic = new Audio('./music/victory.mp3');
        victoryMusic.play();
        victoryMusic.playbackRate = 1;
        victoryMusic.loop =true;
      }, 1000)
      setNavbar(true);
      setVictory(true);
    }, duration * 60000);
  }

  const handleMusic = (state) => {
    if(state){
      const music2 = new Audio('./music/playmu.wav');
      music2.playbackRate = 3;
      music2.play();
      setTimeout(() => {
        stopMusic.pause();
        music.play();
        music.playbackRate = 1;
      }, 1000)
    }else{
      const music2 = new Audio('./music/stopmu.wav');
      music2.playbackRate = 3;
      music2.play();
      setTimeout(() => {
        music.pause();
        stopMusic.play();
        stopMusic.playbackRate = 1;
        stopMusic.loop =true;
      }, 1000)
    }
  }

  const init = () => {
    setTimeout(() => {
      handleSocket();
    }, 3000)
    setNavbar(false);
    handleMusic(true);
  }

  const reload = () => {
    socket.emit('reload');
    window.location.reload();
  }

  useEffect(() => {
    handleIp()
  }, [])

  return (
    <div 
      className={`flex flex-row h-screen`} 
      style={{backgroundImage: 'url(./assets/bg.jpg)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'}}
    >
      {
        victory && (
          <div className="flex absolute justify-center items-center top-0 bottom-0 left-0 right-0 bg-black/75 z-20">
            <div className="flex flex-col p-2 justify-center h-5/6 w-3/6 bg-black rounded-lg">
              <h1 className="text-green-500 font-bold text-3xl text-center">Fim de Jogo!</h1>
              <p className="text-white text-center text-xl">Veja o resultado na tela do seu celular!</p>
              <p className="text-white mt-16">Resultado de alguns jogadores:</p>
              <div className="grid grid-cols-2 space-x-12 px-4">
                <ul className="text-green-500 h-48 overflow-y-scroll">
                  {
                    playersVictory.map(element => (
                      <li className="flex" key={element}><GiMusicalNotes /> - {element}</li>
                    ))
                  }
                </ul>
                <ul className="text-red-500 h-48 overflow-y-scroll">
                  {
                    playersGameOuver.map(element => (
                      <li className="flex" key={element}><GiMusicalNotes /> - {element}</li>
                    ))
                  }
                </ul>
              </div>
              <button type="button" className="flex justify-center items-center bg-blue-500 rounded-2xl mt-12 px-6 py-2 animate-bounce text-white" onClick={() => {reload()}}>
                <IoReloadOutline className="mr-2"/>Novo jogo
              </button>
            </div>
          </div>
        )
      }
      {
        navbar? (
          <div className="flex flex-col items-center bg-white w-2/6 h-screen">
            <div className="flex items-center mt-6">
              <img src="./assets/logo.png" className="h-12"/>
              <h1 className="text-xl text-center">Dance Until</h1>
            </div>
            <button 
              type="button"
              className="flex items-center justify-center bg-blue-600 text-white py-2 px-6 w-36 animate-bounce mt-6 rounded-2xl font-bold"
              onClick={() => {init()}}
            >
              <BsPlayFill />PLAY
            </button>
            <div className="flex mb-6 mt-6">
              <p>Duração (em minutos): </p>
              <input
                className="border pl-2 w-24"
                placeholder="Duração"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value)
                }}
              />
            </div>
            <div>
              <QRCode value={`${ip}:3003`}/>
            </div>
          </div>
        ):
        (<></>)
      }
      {
        !navbar && pause && (
          <img className="h-screen w-screen" src="./assets/luz.gif" onClick={() => {setNavbar(!navbar)}} />
        )
      }
      <div className="absolute right-0 m-2 bg-black/75 p-2 rounded-lg h-6/6">
        <p className="text-white w-64">
          O Dance Until é um jogo para que você 
          demostre seu controle sobre a música!
        </p>
        <p className="text-green-500 w-64 underline">
          Alguns jogadores:
        </p>
        <ul className="text-green-500 h-96 overflow-y-scroll">
          {
            players.map(element => (
              <li className="flex" key={element}><GiMusicalNotes /> - {element}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default Main;
