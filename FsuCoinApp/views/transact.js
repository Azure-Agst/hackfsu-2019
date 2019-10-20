import { Dimensions, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';


// supress yellow because fuck it, we don't have time
console.disableYellowBox = true;

// import views
import { Home } from './main/index.js';
import { Send } from './main/send.js';
import { Scan } from './main/scan.js';
import { Recieve } from './main/recieve.js';
import { ConfirmTrans } from './main/confirm.js';

// Get screen width
const {width} = Dimensions.get('window')

// Main Drawer Nav
const TransStack = createStackNavigator({
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
  headerTintColor: "#CEB888",
})

// Main app container
//const AppContainer = createAppContainer(RootDrawer);
export default TransStack;