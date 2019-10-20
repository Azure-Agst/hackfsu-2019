import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,
        Dimensions, BackHandler, ActivityIndicator, AsyncStorage } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

//constant
const bkgColor = '#782F40';
const {height, width} = Dimensions.get('window')

export class ConfirmTrans extends React.Component {
    static navigationOptions = {
        title: 'Confirm',
        headerStyle: {backgroundColor: "#CEB888"}
    };

    onComponentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }

    goBack() {
        this.props.navigation.goBack();
    }

    handleTapYes() {
        const { value, addr } = this.props.navigation.state.params;
        alert(`${value} Points Sent!`);
        AsyncStorage.setItem("@FSUCoin:pendingVal", value.toString())
        this.props.navigation.goBack();
    }
    
    render() {
        const { navigate } = this.props.navigation;
        const { value, addr } = this.props.navigation.state.params;
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bkgColor, }}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
                    <Text style={{color:"white", fontWeight: "bold", fontSize: 32,}}>Confirm</Text>
                </View>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
                    <Text style={{color:"white", textAlign: "center", fontSize: 22,}}>Are you sure you want to send {value} points to:</Text>
                    <Text style={{color:"white", textAlign: "center", fontSize: 16,}}>{addr}</Text>
                </View>
                <View style={styles.transfer}>
                    <View style={styles.transButton}>
                        <Text style={styles.send} onPress={() => this.handleTapYes()}>Yes</Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.transButton}>
                        <Text style={styles.recieve} onPress={() => this.props.navigation.goBack()}>No</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    transfer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#CEB888",
        height: height/3,
        borderTopColor: "#2C2A29",
        borderTopWidth: 4,
    },
    transButton: {
        flex: 1,
        width: width/2,
        justifyContent: "center", 
        alignItems: "center"
    },
    divider:{
        width: 2,
        backgroundColor: "#2C2A29",
    },
    send: {
        justifyContent: 'flex-start',
        fontWeight: 'bold',
        fontSize: 32,
        color: "#782F40"
    },
    recieve: {
        justifyContent: 'flex-end',
        fontWeight: 'bold',
        fontSize: 32,
        color: "#782F40"
    }
});