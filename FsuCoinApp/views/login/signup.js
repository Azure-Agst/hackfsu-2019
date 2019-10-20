import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, AsyncStorage } from 'react-native';
import { Updates } from 'expo';
import * as SecureStore from 'expo-secure-store';


const enableTestAccount = true

//Once again, for sizing
const {height, width} = Dimensions.get('window')

export default class Signup extends React.Component{
    // fsucoin-api.azureagst.dev/signup
    static navigationOptions = {
        title: 'Signup',
        headerStyle: {backgroundColor: "#CEB888"}
    };

    state = {
        user: "",
        pass: "",
        name: ""
    }

    handleChange(varia, value) {
        if (varia == 'user') {
            this.setState({user: value})
        } else if (varia == 'pass') {
            this.setState({pass: value})
        } if (varia == 'name') {
            this.setState({name: value})
        }
    }

    handleSubmit() {
        const { navigate } = this.props.navigation;
        let formdata = new FormData();
        formdata.append("username", this.state.user)
        formdata.append("password", this.state.pass)
        formdata.append("name", this.state.name)
        fetch('http://fsucoin-api.azureagst.dev/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formdata
        })
        .then((response) => {
            SecureStore.setItemAsync('FSUCoin_cookie', response.headers.get("set-cookie"))
            return response.json()
        })
        .then((responseJson) => {
            SecureStore.setItemAsync('FSUCoin_userData', JSON.stringify(responseJson));
            Updates.reloadFromCache();
            navigate('Home')
        })
    }

    async testLogin(){
        const { navigate } = this.props.navigation;
        SecureStore.setItemAsync('FSUCoin_userData', JSON.stringify({
            "user": "TestUser1",
            "name": "John Appleseed",
            "address": "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
            "value": 1500
        }));
        //SecureStore.setItemAsync("FSUCoin_pendingVal", "25");
        Updates.reloadFromCache();
        //navigate("Home");
    }

    render(){
        const { goBack } = this.props.navigation;
        return(
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#782F40', flexDirection: 'column'}}>
                <View style={{flex: 1,  justifyContent: "center", alignItems: "center",}}>
                    <Text style={{color:"white",fontWeight:"bold",fontSize:32}}>Login</Text>
                    <View style={{height: 15}}/>
                </View>
                <View style={{flex: 2}}>
                    <TextInput 
                        style={{backgroundColor:"#ffffff", width: width*0.9, height: 50, marginBottom:25}}
                        placeholder="Name"
                        onChangeText={text => this.handleChange("name", text)}
                    />
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
                        title="Signup!"
                        color="#CEB888"
                        onPress={() => this.handleSubmit()}
                    />
                    <View style={{height: 10}}/>
                    <Text
                        style={{color:"white", textAlign:"center"}}
                        onPress={() => goBack()}
                    >Have an account already? Log in here!</Text>
                    {enableTestAccount && (
                        <>
                            <View style={{height: 30}}/>
                            <Text
                                style={{color:"white", textAlign:"center"}}
                                onPress={() => this.testLogin()}
                            >Secret!</Text>
                        </>
                    )}
                </View>
                <View style={{flex: 3}}/>
            </View>
        )
    }
}