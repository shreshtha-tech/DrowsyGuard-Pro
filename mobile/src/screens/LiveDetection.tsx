import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { PhoneCall } from 'lucide-react-native';
import * as Location from 'expo-location';
import AlertOverlay from '../components/AlertOverlay';

const LiveDetection = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [results, setResults] = useState<any>(null);
  const cameraRef = useRef<any>(null);
  const ws = useRef<WebSocket | null>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(camStatus === 'granted');
      if (locStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();

    // Initialize WebSocket
    ws.current = new WebSocket('ws://127.0.0.1:8000/api/detect/stream');
    ws.current.onmessage = (e) => {
      setResults(JSON.parse(e.data));
    };
    ws.current.onerror = (e) => console.log('WS Error:', e);

    return () => ws.current?.close();
  }, []);

  // Capture and send frames
  useEffect(() => {
    const interval = setInterval(async () => {
      if (cameraRef.current && ws.current?.readyState === WebSocket.OPEN) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          base64: true,
          skipProcessing: true,
        });
        
        ws.current.send(JSON.stringify({
          image: photo.base64,
          driver_id: 1,
          location: location
        }));
      }
    }, 500); // 2 FPS for stability

    return () => clearInterval(interval);
  }, [location]);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View className="flex-1 bg-black">
      <Camera 
        ref={cameraRef}
        className="flex-1"
        type={Camera.Constants.Type.front}
      >
        <View className="flex-1 bg-black/20 justify-between p-6">
          <View className="flex-row justify-between items-center mt-8">
            <View className="bg-black/50 px-4 py-2 rounded-full border border-white/20">
              <Text className="text-white font-bold">DrowsyGuard Pro</Text>
            </View>
            <TouchableOpacity className="bg-red-600 p-3 rounded-full">
              <PhoneCall size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="w-48 h-48 rounded-full border-8 border-white/10 items-center justify-center">
              <View 
                className={`w-40 h-40 rounded-full border-4 items-center justify-center ${
                  results?.alert_stage >= 3 ? 'border-red-500' : results?.alert_stage >= 1 ? 'border-yellow-500' : 'border-green-500'
                }`}
              >
                <Text className="text-white text-5xl font-bold">{results?.fatigue_score || 0}</Text>
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold">Fatigue Score</Text>
              </View>
            </View>
          </View>

          <View className="bg-black/60 p-6 rounded-3xl border border-white/10">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-white/60 text-xs uppercase">EAR</Text>
                <Text className="text-white text-lg font-bold">{results?.ear || '0.00'}</Text>
              </View>
              <View>
                <Text className="text-white/60 text-xs uppercase">MAR</Text>
                <Text className="text-white text-lg font-bold">{results?.mar || '0.00'}</Text>
              </View>
              <View>
                <Text className="text-white/60 text-xs uppercase">Eyes Closed</Text>
                <Text className="text-white text-lg font-bold">{results?.eyes_closed_duration || '0.0'}s</Text>
              </View>
            </View>
          </View>
        </View>
      </Camera>

      <AlertOverlay stage={results?.alert_stage || 0} score={results?.fatigue_score || 0} />
    </View>
  );
};

export default LiveDetection;
