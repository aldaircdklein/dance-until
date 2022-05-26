import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import socketIOClient from "socket.io-client";
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [navbar, setNavbar] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [gamerOuver, setGamerOuver] = useState(false);
  const [gamerOuver3, setGamerOuver3] = useState(false);
  let gameOuver2 = false;
  const [pause, setPause] = useState(true);
  const [username, setUsername] = useState('');
  const [victory, setVictory] = useState(false);

  const handleSocket = (url: string) => {
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

  const handleFinish = (state: Boolean) => {
    if(state){
      setVictory(!gamerOuver);
      Accelerometer.removeAllListeners();
      setGamerOuver3(gameOuver2);
    }
  }

  const handleSensors = (state: Boolean, init: Boolean) => {
    if(init){
      setTimeout(() => {
        Accelerometer.removeAllListeners();
        Accelerometer.addListener(accelerometerData => {
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
        Accelerometer.setUpdateInterval(1000);
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
      await BarCodeScanner.requestPermissionsAsync();
      await Accelerometer.requestPermissionsAsync();
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    handleSocket(data);
  };

  return (
    <View style={styles.container}>
      {
        navbar && (
          <>
            <Image source={require('./assets/logo.png')} style={{width: 150, height: 150}} />
            <Text style={{color: 'white', fontSize: 30}}>Dance Until</Text>
            <TextInput
              placeholder='Nome de jogador'
              value={username}
              onChangeText={setUsername}
              style={{color: 'yellow', fontSize: 20,marginTop: 55, marginBottom: 55, textAlign: 'center'}}
            />
            <Button title='Iniciar' onPress={() => {setNavbar(false)}}></Button>
          </>
        )
      }
      {
        !scanned && !navbar &&(
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={{color: 'yellow', fontSize: 30}}>Aponte para o QRCode</Text>
          </>
        )
      }
      {
        pause && scanned && !gamerOuver && !victory &&(
          <ImageBackground source={require('./assets/bg.jpg')} style={{width: 400, flex: 1}} />
        )
      }
      {
        !pause && scanned && !gamerOuver && !victory &&(
          <ImageBackground source={require('./assets/luz.gif')} style={{width: 400, flex: 1}} />
        )
      }
      {
        !victory && gamerOuver3 || gamerOuver && (
          <>
            <ImageBackground source={require('./assets/gameouver.jpg')} style={{width: 400, flex: 1}} />
            <Text style={{color: 'white', fontSize: 20, position: 'absolute'}}>Você perdeu!</Text>
          </>
        )
      }
      {
        victory && !gamerOuver && (
          <>
            <ImageBackground source={require('./assets/victory.jpg')} style={{width: 400, flex: 1}} />
            <Text style={{color: 'white', fontSize: 20, position: 'absolute'}}>Você dança muitooooooo!</Text>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteFillObject: {
    zIndex: 10,
    position: 'absolute',
    flex: 1,
    height: 96
  }
});
