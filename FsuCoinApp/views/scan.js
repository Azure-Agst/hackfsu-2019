import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,
        Dimensions, BackHandler, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

//constant
const bkgColor = '#782F40';

export class Scan extends React.Component {
    static navigationOptions = {
        title: 'Send',
        headerStyle: {backgroundColor: "#CEB888"}
    };

    state = {
        hasCameraPermission: null,
        scanned: false,
        value: 100
    };

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });

        //value
        const { value } = this.props.navigation.state.params;
        this.setState({value: value})
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        const { navigate } = this.props.navigation;
        navigate('Home');
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ scanned: true });
        const { navigate } = this.props.navigation;
        navigate('Confirm', { value: this.state.value, addr: data})
        this.setState({ scanned: false });
    };

    handleValueChange = (value) => {
        this.setState({value: value})
        console.warn(this.state.value)
    }

    renderCamera() {
        const { hasCameraPermission, scanned } = this.state;
        const { goBack } = this.props.navigation;
        if (hasCameraPermission === null) {
            return (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{color: "white", fontWeight: "bold",}}>Initializing Camera....</Text>
                </View>
            )
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return(
                // Hack to not wrap in another view
                <>  
                    <Camera
                        useCamera2Api={true} 
                        barCodeScannerSettings={{
                            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                        }}
                        onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                        style={{...StyleSheet.absoluteFill, flexDirection: 'column'}}>
                        <View style={{flex:1, backgroundColor:bkgColor, justifyContent: "center", alignItems: "center",}}>
                            <Text style={{color:"white", fontWeight: "bold", fontSize: 32,}}>Scan Code</Text>
                        </View>
                        <View id="MAIN SCAN ELEMENT" style={{flex: 2, flexDirection: 'row'}}>
                            <View style={{flex: 1, backgroundColor:bkgColor}} />
                            <View style={{flex: 4}} />
                            <View style={{flex: 1, backgroundColor:bkgColor}} />
                        </View>
                        <View style={{flex:1, backgroundColor:bkgColor, justifyContent: "center", alignItems: "center",}}>
                            {scanned && (
                                <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
                            )}
                        </View>
                        <View style={{flex:1, backgroundColor:"#CEB888", justifyContent: "center", alignItems: "center", borderTopColor: "#2C2A29", borderTopWidth: 4,}}>
                            <Text style={{justifyContent: 'flex-start', fontWeight: 'bold', fontSize: 32, color: "#782F40"}} onPress={() => goBack()}>Back</Text>
                        </View>
                    </Camera>
                    
                </>
            )
        }
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
    camera: {
        width: width,
        height: width,
    }
});