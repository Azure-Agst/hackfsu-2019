import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, AsyncStorage } from 'react-native';
import { Updates } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';

//Once again, for sizing
const {height, width} = Dimensions.get('window')

export default class Login extends React.Component{
    // http://fsucoin-api.azureagst.dev/login
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Login',
            headerStyle: {backgroundColor: "#CEB888"},
            headerLeft: (
                <Icon name="bars" style={{marginLeft: 15, fontSize:24,}} onPress={() => navigation.openDrawer()}/>
            )
        }
    };

    state = {
        user: "",
        pass: "",
        dataLoaded: false, 
        userStore: {}
    }

    async componentDidMount(){
        const value = await SecureStore.getItemAsync('FSUCoin_userData');
        this.setState({dataLoaded: true, userStore: JSON.parse(value)})
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.forceUpdate();
        });
    }

    handleChange(varia, value) {
        if (varia == 'user') {
            this.setState({user: value})
        } else if (varia == 'pass') {
            this.setState({pass: value})
        }
    }

    // handleSubmit(){
    //     // TODO: post request
    //     alert(`User: ${this.state.user}\nPassword: ${this.state.pass}`)
    // }

    refresh() {
        // Force a render without state change...
        this.forceUpdate();
    }

    handleSubmit() {
        const { navigate } = this.props.navigation;
        let formdata = new FormData();
        formdata.append("username", this.state.user)
        formdata.append("password", this.state.pass)
        fetch('http://fsucoin-api.azureagst.dev/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                //'Content-Type': 'application/json',
            },
            body: formdata
        })
        .then((response) => {
            SecureStore.setItemAsync('FSUCoin_cookie', response.headers.get("set-cookie"))
            return response.json()
        })
        .then((responseJson) => {
            SecureStore.setItemAsync('FSUCoin_userData', JSON.stringify(responseJson));
            Updates.reload();
            navigate('Home')
        })
    }

    async handleLogout() {
        const { navigate } = this.props.navigation;
        await SecureStore.deleteItemAsync("FSUCoin_userData");
        await SecureStore.deleteItemAsync("FSUCoin_cookie");
        //await SecureStore.deleteItemAsync("FSUCoin_pendingVal");
        Updates.reload();
        navigate('Home');
    }

    renderPage() {
        const { navigate } = this.props.navigation;
        const {dataLoaded, userStore} = this.state;
        if (dataLoaded && userStore !== null) {
            return(
                // logout
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#782F40', flexDirection: 'column'}}>
                    <View style={{flex: 1,  justifyContent: "center", alignItems: "center",}}>
                        <Text style={{color:"white",fontWeight:"bold",fontSize:32}}>Logged In!</Text>
                        <View style={{height: 15}}/>
                        <Text style={{color:"white",}}>Logged in as {userStore.username}.</Text>
                    </View>
                    <View style={{flex: 1,  justifyContent: "center", alignItems: "center",}}>
                        <Button
                            title="Logout!"
                            color="#CEB888"
                            onPress={() => this.handleLogout()}
                        />
                    </View>
                </View>
            )
        } else {
            return(
                // login
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#782F40', flexDirection: 'column'}}>
                    <View style={{flex: 1,  justifyContent: "center", alignItems: "center",}}>
                        <Text style={{color:"white",fontWeight:"bold",fontSize:32}}>Login</Text>
                        <View style={{height: 15}}/>
                    </View>
                    <View style={{flex: 2}}>
                        <TextInput 
                            style={{backgroundColor:"#ffffff", width: width*0.9, height: 50, marginBottom:25}}
                            placeholder="Username"
                            onChangeText={text => this.handleChange("user", text)}
                        />
                        <TextInput 
                            style={{backgroundColor:"#ffffff", width: width*0.9, height: 50, marginBottom:25}}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={text => this.handleChange("pass", text)}
                        />
                        <Button
                            title="Login!"
                            color="#CEB888"
                            onPress={() => this.handleSubmit()}
                        />
                        <View style={{height: 10}}/>
                        <Text
                            style={{color:"white", textAlign:"center"}}
                            onPress={() => navigate('Signup')}
                        >Need an account? Sign up here!</Text>
                    </View>
                    <View style={{flex: 3}}/>
                </View>
            )
        }
    }

    render(){
        return(
            <>
                {this.renderPage()}
            </>
        )
    }
}