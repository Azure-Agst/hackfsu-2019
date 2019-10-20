import React from 'react';
import { Text, View, Dimensions, BackHandler } from 'react-native';
import QRCode from 'react-native-qrcode';

//constant
const bkgColor = '#782F40';

//Once again, for sizing
const {height, width} = Dimensions.get('window')

export class Recieve extends React.Component {
    static navigationOptions = {
        title: 'Recieve',
        headerStyle: {backgroundColor: "#CEB888"}
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

    render() {
    const { goBack } = this.props.navigation;
    const { addr } = this.props.navigation.state.params;
        return(
            // Hack to not wrap in another view
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bkgColor, }}>
                <View style={{flex:1, backgroundColor:bkgColor, justifyContent: "center", alignItems: "center",}}>
                    <Text style={{color:"white", fontWeight: "bold", fontSize: 32,}}>Recieve</Text>
                </View>
                <View style={{flex: 2, alignItems: "center",}}>
                    <Text style={{color:"white",marginBottom:20,}}>Show this to who you want to recieve credits from!</Text>
                    <Text style={{height:10}}/>
                    <View style={{overflow:'hidden', backgroundColor:'#CEB888', width:width*0.7, height:width*0.7, justifyContent: "center", alignItems: "center",}}>
                        <QRCode 
                            backgroundColor='#CEB888'
                            value={addr}
                            size={256}
                        />
                    </View>
                </View>
                <View style={{flex:1, width: width, backgroundColor:"#CEB888", justifyContent: "center", alignItems: "center", borderTopColor: "#2C2A29", borderTopWidth: 4,}}>
                    <Text style={{justifyContent: 'flex-start', fontWeight: 'bold', fontSize: 32, color: "#782F40"}} onPress={() => goBack()}>Back</Text>
                </View>
            </View>
        )
    }
}