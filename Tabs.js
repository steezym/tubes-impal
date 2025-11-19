import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { View, Image } from 'react-native';

import Home from './Home';

import Search from './Search';

import Chat from './Chat';

import HomeIcon from './assets/icons/home.png';
import SearchIcon from './assets/icons/search.png';
import MessageIcon from './assets/icons/message.png';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#87A347',
        tabBarStyle: {
          paddingTop: 10,
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#fff',
          borderRadius: 30,
          height: 60,
          marginHorizontal: 100,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={HomeIcon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#87A347' : '#000',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={SearchIcon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#87A347' : '#000',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={MessageIcon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#87A347' : '#000',
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
