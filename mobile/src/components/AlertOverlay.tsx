import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, AlertOctagon } from 'lucide-react-native';

interface AlertOverlayProps {
  stage: number;
  score: number;
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({ stage, score }) => {
  if (stage === 0) return null;

  const getAlertConfig = () => {
    switch (stage) {
      case 1:
        return {
          color: 'bg-yellow-500/30',
          borderColor: 'border-yellow-500',
          title: 'CAUTION',
          msg: 'Drowsiness detected. Stay alert.',
          icon: AlertTriangle
        };
      case 2:
        return {
          color: 'bg-orange-500/40',
          borderColor: 'border-orange-500',
          title: 'WARNING',
          msg: 'Frequent blinking. Take a break?',
          icon: AlertTriangle
        };
      case 3:
        return {
          color: 'bg-red-600/50',
          borderColor: 'border-red-600',
          title: 'DANGER',
          msg: 'CRITICAL DROWSINESS! PULL OVER!',
          icon: AlertOctagon
        };
      case 4:
        return {
          color: 'bg-red-800/80',
          borderColor: 'border-white',
          title: 'MAX ALERT',
          msg: 'SOS TRIGGERING IN 5 SECONDS...',
          icon: AlertOctagon
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <View className={`absolute inset-0 pointer-events-none items-center justify-center p-6 ${config.color}`}>
      <View className={`bg-black/90 p-8 rounded-3xl border-4 items-center shadow-2xl ${config.borderColor}`}>
        <Icon size={64} color={stage >= 3 ? '#ef4444' : '#f59e0b'} />
        <Text className={`text-3xl font-black mt-4 ${stage >= 3 ? 'text-red-500' : 'text-yellow-500'}`}>
          {config.title}
        </Text>
        <Text className="text-white text-center mt-2 text-lg font-bold">
          {config.msg}
        </Text>
        <View className="mt-4 bg-white/10 px-4 py-2 rounded-full">
          <Text className="text-white font-mono">FATIGUE SCORE: {score}%</Text>
        </View>
      </View>
    </View>
  );
};

export default AlertOverlay;
