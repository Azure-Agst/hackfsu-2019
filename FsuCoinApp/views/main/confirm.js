import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,
        Dimensions, BackHandler, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

//constant
const bkgColor = '#782F40';
const {height, width} = Dimensions.get('window')

export class ConfirmTrans extends React.Component {
    static navigationOptions = {
        title: 'Confirm',
        headerStyle: {backgroundColor: "#CEB888"}
    };

    state = {
        curVal: null,
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
        // try {
        //     SecureStore.getItemAsync("FSUCoin_pendingVal").then((value) => {
        //         this.setState({curVal: value})
        //     }).catch((error) => {
        //         console.warn(error)
        //     });
        // } catch (error) {
        //     console.warn(error)
        //     item = null
        // }
    }

    goBack() {
        this.props.navigation.goBack();
    }

    handleTapYes() {
        const { value } = this.props.navigation.state.params;
        //SecureStore.setItemAsync('FSUCoin_pendingVal', (+this.state.curVal + +value).toString())
        alert(`${value} Points Sent!`);
        this.props.navigation.state.params.refreshMain();
        this.goBack();
    }
    
    renderConfirm() {
        const { navigate } = this.props.navigation;
        const { value, addr } = this.props.navigation.state.params;
        console.log(this.state.curVal)
        if (this.state.curVal === null){
            return(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#782F40'}}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{color: "white", fontWeight: "bold",}}>Thinking....</Text>
                </View>
            )
        } else {
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

    render() {
        return(
            <>
                {this.renderConfirm()}
            </>
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