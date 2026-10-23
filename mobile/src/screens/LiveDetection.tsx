import { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Button, StyleSheet, Text, View } from 'react-native';
import AlertOverlay from '../components/AlertOverlay';

interface DetectionResult {
  face_detected: boolean;
  fatigue_score: number;
  alert_stage: number;
  ear: number;
  mar: number;
  eyes_closed_duration: number;
}

interface Coordinates { lat: number; lng: number }

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const streamUrl = apiUrl?.replace(/^http/, 'ws').replace(/\/$/, '') + '/api/detect/stream';

export default function LiveDetection() {
  const [permission, requestPermission] = useCameraPermissions();
  const [connection, setConnection] = useState('Connecting');
  const [results, setResults] = useState<DetectionResult | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const locationRef = useRef<Coordinates | null>(null);
  const capturingRef = useRef(false);

  useEffect(() => {
    if (!apiUrl) {
      setConnection('Set EXPO_PUBLIC_API_URL to your API address');
      return;
    }
    const socket = new WebSocket(streamUrl);
    socketRef.current = socket;
    socket.onopen = () => setConnection('Connected');
    socket.onclose = () => setConnection('Disconnected');
    socket.onerror = () => setConnection('Connection failed');
    socket.onmessage = event => {
      try {
        const result = JSON.parse(event.data) as DetectionResult & { error?: string };
        if (result.error) setConnection(result.error);
        else setResults(result);
      } catch {
        setConnection('Invalid response from API');
      }
    };
    Location.requestForegroundPermissionsAsync()
      .then(async response => {
        if (response.status === 'granted') {
          const position = await Location.getCurrentPositionAsync({});
          locationRef.current = { lat: position.coords.latitude, lng: position.coords.longitude };
        }
      })
      .catch(() => { /* Detection can continue without location. */ });
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!permission?.granted) return;
    const interval = setInterval(async () => {
      const socket = socketRef.current;
      if (!cameraRef.current || socket?.readyState !== WebSocket.OPEN || capturingRef.current) return;
      capturingRef.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.3, base64: true, skipProcessing: true });
        if (photo?.base64 && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ image: photo.base64, driver_id: 1, location: locationRef.current ?? {} }));
        }
      } catch {
        setConnection('Camera capture failed');
      } finally {
        capturingRef.current = false;
      }
    }, 500);
    return () => clearInterval(interval);
  }, [permission?.granted]);

  if (!permission) return <View style={styles.center}><Text style={styles.text}>Checking camera permission…</Text></View>;
  if (!permission.granted) {
    return <View style={styles.center}><Text style={styles.text}>Camera access is required for detection.</Text><Button title="Grant camera access" onPress={requestPermission} /></View>;
  }
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />
      <View style={styles.header}>
        <Text style={styles.heading}>DrowsyGuard Pro</Text>
        <Text style={styles.status}>{connection}</Text>
      </View>
      <View style={styles.metrics}>
        <Text style={styles.score}>{results?.face_detected ? results.fatigue_score : '—'}%</Text>
        <Text style={styles.text}>{results?.face_detected ? 'Fatigue score' : 'Position your face in view'}</Text>
        <Text style={styles.text}>EAR: {results?.ear ?? '—'}   MAR: {results?.mar ?? '—'}</Text>
        <Text style={styles.text}>Eyes closed: {results?.eyes_closed_duration ?? 0}s</Text>
      </View>
      <AlertOverlay stage={results?.alert_stage ?? 0} score={results?.fatigue_score ?? 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'space-between' },
  center: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { marginTop: 56, marginHorizontal: 20, padding: 16, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 14 },
  heading: { color: '#fff', fontSize: 20, fontWeight: '700' },
  status: { color: '#d1d5db', marginTop: 4 },
  metrics: { margin: 20, padding: 20, backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 18, alignItems: 'center' },
  score: { color: '#fff', fontSize: 48, fontWeight: '800' },
  text: { color: '#fff', textAlign: 'center', marginTop: 8 },
});
