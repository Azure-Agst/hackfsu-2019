import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,
        Dimensions, BackHandler, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

//constant
const bkgColor = '#782F40';

export class Send extends React.Component {
    static navigationOptions = {
        title: 'Send',
        headerStyle: {backgroundColor: "#CEB888"}
    };

    state = {
        value: 100
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }

    handleValueChange = (value) => {
        this.setState({value: value})
        //console.warn(this.state.value)
    }

    renderCamera() {
    const { goBack, navigate } = this.props.navigation;
    const { refreshMain, curPend } = this.props.navigation.state.params;
        return(
            // Hack to not wrap in another view
            <>  
                <View style={{flex:1, backgroundColor:bkgColor, justifyContent: "center", alignItems: "center",}}>
                    <Text style={{color:"white", fontWeight: "bold", fontSize: 32,}}>Send</Text>
                </View>
                <View style={{flex: 2, }}>
                    <Text style={{color:"white",marginBottom:20,}}>How many points do you want to send?</Text>
                    <TextInput 
                        style={{backgroundColor:"#ffffff", width: width*0.8, height: 70, borderWidth: 10, borderColor:"#ffffff", }}
                        keyboardType="number-pad"
                        placeholder="100"
                        onChangeText={text => this.handleValueChange(text)}
                    />
                </View>
                <View style={styles.transfer}>
                    <View style={styles.transButton}>
                        <Text style={styles.send} onPress={() => navigate('Scan', {value: this.state.value, refreshMain: refreshMain})}>Continue</Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.transButton}>
                        <Text style={styles.recieve} onPress={() => goBack()}>Back</Text>
                    </View>
                </View>
            </>
        )
    }

    render() {
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bkgColor, }}>
                {this.renderCamera()}
            </View>
        )
    }
}

//Once again, for sizing
const {height, width} = Dimensions.get('window')

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