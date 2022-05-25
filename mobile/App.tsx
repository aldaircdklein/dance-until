import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import socketIOClient from "socket.io-client";
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [scanned, setScanned] = useState(false);
  const [gamerOuver, setGamerOuver] = useState(false);
  const [pause, setPause] = useState(true);
  const [victory, setVictory] = useState(false);

  const handleSocket = (url: string) => {
    console.log(url);
    const socket = socketIOClient(`http://${url}`);
    console.log('entrei')
    socket.emit('players', {username: 'Aldair doidão'});
    socket.on("newStatus", (req) => {
      console.log(req.data.status);
      setPause(!req.data.status);
      handleSensors(req.data.status, req.data.init);
    })
    socket.on("newFinish", (req) => {
      console.log(req.data.status);
      handleFinish(req.data.status);
    })
  }

  const handleFinish = (state: Boolean) => {
    if(state){
      setVictory(!gamerOuver);
      Accelerometer.removeAllListeners();
    }
  }

  const handleSensors = (state: Boolean, init: Boolean) => {
    if(init){
      setTimeout(() => {
        Accelerometer.removeAllListeners();
        Accelerometer.addListener(accelerometerData => {
          console.log(accelerometerData)
          if(state){
            if(Number(Math.abs(accelerometerData.x).toFixed(2)) == 0.99 || Number(Math.abs(accelerometerData.y).toFixed(2)) == 0.99 || Number(Math.abs(accelerometerData.z).toFixed(2)) == 0.99){
              if(Math.abs(Math.trunc(accelerometerData.x)) == 0 && Math.abs(Math.trunc(accelerometerData.y)) == 0 || 
                  Math.abs(Math.trunc(accelerometerData.y)) == 0 && Math.abs(Math.trunc(accelerometerData.z)) == 0 ||
                  Math.abs(Math.trunc(accelerometerData.z)) == 0 && Math.abs(Math.trunc(accelerometerData.x)) == 0
              ){
                console.log('para dançar')
                setGamerOuver(true);
              }
            }
          }else{
            if(Math.abs(accelerometerData.x) > 1 || Math.abs(accelerometerData.y) > 1 || Math.abs(accelerometerData.z) > 1){
              console.log('para parar')
              setGamerOuver(true);
            }
          }
        })
        Accelerometer.setUpdateInterval(1000);
      }, 1000)
    }
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
        !scanned && (
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
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
        gamerOuver && !victory && (
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
  }
});
