import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wj03.mmimagelinks',
  appName: 'MMImage Links',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: { enabled: true },
  },
};

export default config;
