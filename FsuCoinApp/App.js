import React from 'react';
import { Dimensions, YellowBox } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// supress yellow because fuck it, we don't have time
console.disableYellowBox = true;

// import views
import { Home } from './views/home/index.js';
import { Send } from './views/send.js';
import { Scan } from './views/scan.js';
import { Recieve } from './views/recieve.js';
import { ConfirmTrans } from './views/confirm.js';

// Get screen width
const {width} = Dimensions.get('window')

// Main Drawer Nav
const RootDrawer = createStackNavigator({
  Home: {
    screen: Home,
  },
  Scan: {
    screen: Scan,
  },
  Send: {
    screen: Send,
  },
  Confirm: {
    screen: ConfirmTrans,
  },
  Recieve: {
    screen: Recieve,
  }
}, {
  mode: "card",
  headerMode: "float",
  headerLayoutPreset: "left",
  headerTransitionPreset: "fade-in-place",
  headerTintColor: "#CEB888"
})

// Main app container
const AppContainer = createAppContainer(RootDrawer);
export default AppContainer;