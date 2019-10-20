import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/FontAwesome5';

// supress yellow because fuck it, we don't have time
console.disableYellowBox = true;

// Imports
import TransStack from './views/transact.js'
import UserStack from './views/user.js'

// Get screen width
const {width} = Dimensions.get('window')

// Main Drawer Nav
const RootDrawer = createDrawerNavigator({
  Wallet: {
    screen: TransStack,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (
        <Icon name="wallet" style={{fontSize:24, color:tintColor }} />
      )
    }
  },
  Account: {
    screen: UserStack,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (
        <Icon name="users-cog" style={{fontSize:24, color:tintColor }} />
      )
    }
  },
}, {
  contentComponent: (props) => (
    <SafeAreaView>
      <ScrollView
        forceInset={{ top: 'always', horizontal: 'never' }}
      > 
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('./assets/icon.png')} />
        </View>
        <DrawerNavigatorItems {...props} />
      </ScrollView>
    </SafeAreaView>
   ),
  drawerWidth: width/2,
  drawerBackgroundColor: "#CEB888",
  contentOptions: {
    activeTintColor: '#782F40',
  }
})

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 20,
    justifyContent: "center", 
    alignItems: "center",
  },
  logo: {
    flex: 1,
    width: width/2.5,
    height: width/2.5,
  },
});

// Main app container
const AppContainer = createAppContainer(RootDrawer);
export default AppContainer;