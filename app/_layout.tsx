import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data/mockData';
import { useFonts } from 'expo-font';
import { ZenDots_400Regular } from '@expo-google-fonts/zen-dots';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.style = [{ fontFamily: 'Inter_600SemiBold' }];

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? COLORS.white : COLORS.grey}
      />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ZenDots_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: COLORS.white,
          tabBarInactiveTintColor: COLORS.grey,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Lobby',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="connect"
          options={{
            title: 'Connect',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#12101E',
    borderTopColor: '#2A2244',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: COLORS.purple,
  },
});
