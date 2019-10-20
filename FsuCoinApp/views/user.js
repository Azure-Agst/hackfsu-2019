import { Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

// import views
import Login from './login/login.js';
import Signup from './login/signup.js';

// Get screen width
const {width} = Dimensions.get('window')

// Main Drawer Nav
const UserStack = createStackNavigator({
  Login: {
    screen: Login,
  },
  Signup: {
    screen: Signup,
  },
}, {
  mode: "card",
  headerMode: "float",
  headerLayoutPreset: "left",
  headerTransitionPreset: "fade-in-place",
  headerTintColor: "#CEB888",
})

// Main app container
//const AppContainer = createAppContainer(RootDrawer);
export default UserStack;