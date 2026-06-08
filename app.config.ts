import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'scrimble',
  slug: 'scrimble',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'scrimble',
  userInterfaceStyle: 'dark',
  experiments: {
    typedRoutes: true,
  },
  plugins: [
    'expo-router',
    'expo-font',
  ],
});
