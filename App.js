import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import { Camera } from 'expo-camera';
// import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [data, setData] = useState([
    { id: '1', title: 'Vegan' },
    { id: '2', title: 'Gluten Free' },
    { id: '3', title: 'Dairy Free' },
    { id: '4', title: 'Peanut Free' },
    { id: '5', title: 'Treenut Free' },
    { id: '6', title: 'Soy Free' },
  ]);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleCapture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri);
      setCameraVisible(false);
      handleOCR(photo.uri);
    }
  };



  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <TouchableOpacity style={styles.bubble} onPress={() => setBubbleVisible(!bubbleVisible)}>
          <Text style={styles.bubbleText}>☰</Text>
        </TouchableOpacity>
        {bubbleVisible && (
          <View style={styles.listContainer}>
            <FlatList
              data={data}
              renderItem={({ item }) => <Text style={styles.listItem}>{item.title}</Text>}
              keyExtractor={item => item.id}
            />
          </View>
        )}
      </View>
      
      <Button title="Open Camera" onPress={() => setCameraVisible(true)} />
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        value={inputText}
        onChangeText={setInputText}
      />
      <Modal visible={cameraVisible} animationType="slide">
        <Camera style={styles.camera} facing='back' ref={ref => setCameraRef(ref)}>
          <View style={styles.cameraContainer}>
            <Button title="Capture" onPress={handleCapture} />
            <Button title="Close" onPress={() => setCameraVisible(false)} />
          </View>
        </Camera>
      </Modal>
      {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}
      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleContainer: {
    position: 'absolute',
    top: 50,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    right: 20,
    zIndex: 1,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  bubbleText: {
    fontSize: 24,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    maxHeight: 200,
    elevation: 5,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    width: '80%',
    padding: 10,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  result: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});
