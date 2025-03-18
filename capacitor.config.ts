
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8cb88147956947f8aca283fa18d07400',
  appName: 'hana-bright-support',
  webDir: 'dist',
  server: {
    url: 'https://8cb88147-9569-47f8-aca2-83fa18d07400.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
