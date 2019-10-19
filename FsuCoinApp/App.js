import React from 'react';
import { Dimensions, YellowBox } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

// supress yellow because fuck it, we don't have time
console.disableYellowBox = true;

// import views
import { Home } from './views/home/index.js';

// Get screen width
const {width} = Dimensions.get('window')

// Main Drawer Nav
const RootDrawer = createDrawerNavigator({
  Home: Home
}, {
  drawerWidth: width/2,
  contentOptions: {
    activeTintColor: '#782F40'
  }
})

// Main app container
const AppContainer = createAppContainer(RootDrawer);
export default AppContainer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
