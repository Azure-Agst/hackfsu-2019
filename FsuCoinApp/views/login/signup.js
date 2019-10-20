import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

//Once again, for sizing
const {height, width} = Dimensions.get('window')

export default class Signup extends React.Component{
    static navigationOptions = {
        title: 'Signup',
        headerStyle: {backgroundColor: "#CEB888"}
    };

    state = {
        user: "",
        pass: ""
    }

    handleChange(varia, value) {
        if (varia == 'user') {
            this.setState({user: value})
        } else if (varia == 'pass') {
            this.setState({pass: value})
        }
    }

    handleSubmit(){
        // TODO: post request
        alert(`User: ${this.state.user}\nPassword: ${this.state.pass}`)
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
                </View>
                <View style={{flex: 3}}/>
            </View>
        )
    }
}