import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import QRCode from "react-qr-code";
import axios from "axios";
const api = axios.create({baseURL: "http://localhost:3003",});
const socket = socketIOClient("http://localhost:3003/");

function App() {
  const [navbar, setNavbar] = useState(true);
  const music = new Audio('./music/music.mp3');
  const stopMusic = new Audio('./music/music2.mp3');
  const [duration, setDuration] = useState(1);
  const [ip, setIp] = useState('');
  const [pause, setPause] = useState(true);

  const handleIp = async () => {
    const result = await api.get('ip');
    setIp(result.data.address);
  }

  const handleSocket = () => {
    socket.emit('status', {status:true, init:true});
    setInterval(() => {
      const random = Math.random() > 0.5 ? true : false
      socket.emit('status', {status:random, init:true});
      console.log(random);
      setPause(random);
      handleMusic(random);
    }, 30000)
    setTimeout(() => {

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
        navbar? (
          <div className="flex flex-col items-center bg-white w-2/6 h-screen" onClick={() => {setNavbar(!navbar)}}>
            <div className="flex items-center mt-6">
              <img src="./assets/logo.png" className="h-12"/>
              <h1 className="text-xl text-center">Dance Until</h1>
            </div>
            <button 
              type="button"
              className="bg-blue-600 text-white py-2 px-6 w-36 animate-bounce mt-6 rounded-2xl font-bold"
              onClick={() => {init()}}
            >
              PLAY
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
      <p className="absolute right-0 m-2 text-white">
        O Dance Until é um jogo com objetivo
        de estimular a diversão!
      </p>
    </div>
  );
}

export default App;
