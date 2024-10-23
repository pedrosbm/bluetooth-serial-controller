import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ListRenderItem, NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';

// Definindo a tipagem do estado dos dispositivos
interface BluetoothDevice  {
  id: string;
  name: string;
}

const App= () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);

  useEffect(() => {
    // // Habilita o Bluetooth quando o app é iniciado
    // BluetoothSerial.BluetoothSerial.enable()
    //   .then(() => console.log('Bluetooth ativado'))
    //   .catch((err: any) => console.log(err));

    // Busca dispositivos pareados
    BluetoothSerial.BluetoothSerial.list()
      .then((devices: BluetoothDevice[]) => {
        setDevices(devices);
      })
      .catch(err => console.log(err));
  }, []);

  const connectToDevice = (device: BluetoothDevice) => {
    BluetoothSerial.BluetoothSerial.connect(device.id)
      .then(() => {
        setIsConnected(true);
        setConnectedDevice(device);
        console.log(`Conectado a ${device.name}`);
      })
      .catch(err => console.log(err));
  };

  const sendData = (data: string) => {
    if (isConnected && connectedDevice) {
      BluetoothSerial.BluetoothSerial.write(data)
        .then(() => {
          console.log(`Enviado: ${data}`);
        })
        .catch(err => console.log(err));
    } else {
      console.log('Nenhum dispositivo conectado.');
    }
  };

  // Renderização de itens da lista de dispositivos
  const renderDeviceItem: ListRenderItem<BluetoothDevice> = ({ item }) => (
    <Button title={`Conectar ${item.name}`} onPress={() => connectToDevice(item)} />
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Controle do Arduino</Text>

      {!isConnected && (
        <>
          <Text style={{ marginVertical: 10 }}>Dispositivos Pareados:</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={renderDeviceItem}
          />
        </>
      )}

      {isConnected && connectedDevice && (
        <>
          <Text style={{ marginVertical: 10 }}>Conectado a {connectedDevice.name}</Text>
          <Button title="Ligar LED (1)" onPress={() => sendData('1')} />
          <Button title="Desligar LED (0)" onPress={() => sendData('0')} />
        </>
      )}
    </View>
  );
};

export default App;
