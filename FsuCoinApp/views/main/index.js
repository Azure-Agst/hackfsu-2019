import React from 'react';
import { StyleSheet, Text, View, Dimensions, 
    Image, AsyncStorage, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';

// Constants
const exampleName = "Andrew Augustine"
const exampleFSUID = "aea19h"
const exampleAddress = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
const exampleValue = 1500

export class Home extends React.Component {
    constructor(props){
        super(props);
        this.refresh = this.refresh.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            headerStyle: {backgroundColor: "#CEB888"},
            headerLeft: (
                <Icon name="bars" style={{marginLeft: 15, fontSize:24,}} onPress={() => navigation.openDrawer()}/>
            )
        }
    };

    state = {
        dataLoaded: false,
        userStore: {},
        pending: null,
    }

    async componentDidMount(){
        fetch('https://s3.azureagst.dev/userdata.json')
        .then((response) => response.json())
        .then((responseJson) => {
            SecureStore.setItemAsync('FSUCoin_userData', JSON.stringify(responseJson));
            this.setState({
                dataLoaded: true, 
                userStore: responseJson, 
                //pending: pending,
            })
        })
        
        //const pending = await SecureStore.getItemAsync("FSUCoin_pendingVal");
        // this.setState({
        //     dataLoaded: true, 
        //     userStore: userdata, 
        //     //pending: pending,
        // })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.refresh();
        });
    }

    refresh() {
        // Force a render without state change...
        this.forceUpdate();
        //this.setState({ state: this.state });
    }

    renderPage(){
        const { navigate } = this.props.navigation;
        const {dataLoaded, userStore, /*pending*/} = this.state;
        if (dataLoaded && userStore !== null){
            // user data exists
            return(
                <View style={styles.main}>  
                    <View>
                        <Image style={styles.logo} source={require('../../assets/FSU_Seal_500x500.png')} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: height/15, justifyContent: "flex-start" }}>
                        <Text style={styles.name}>{userStore.name}</Text>
                        <Text style={styles.fsuid}>Username: {userStore.user}</Text>
                        <Text style={styles.spacer} />
                        <Text style={styles.address}>{userStore.value /* - +pending*/} Points</Text>
                        {/*pending && (
                            <Text style={styles.fsuid}>[ -{pending} Pending ]</Text>
                        )*/}
                    </View>
                    <View style={styles.transfer}>
                        <View style={styles.transButton}>
                            <Text style={styles.send} onPress={() => navigate('Send', {refreshMain: this.refresh, /*curPend: pending*/})}>Send</Text>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.transButton}>
                            <Text style={styles.recieve} onPress={() => navigate('Recieve', {addr: userStore.addr})}>Receive</Text>
                        </View>
                    </View>
                </View>  
            )
        } else if (dataLoaded && userStore === null) {
            return(
                // Not Logged in
                <View style={styles.main}>  
                    <View>
                        <Image style={styles.logo} source={require('../../assets/FSU_Seal_500x500.png')} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: height/15, justifyContent: "flex-start" }}>
                        <Text style={styles.name}>Not Logged In!</Text>
                    </View>
                    <View style={styles.login}>
                        <Text style={styles.recieve} onPress={() => navigate('Login')}>Login</Text>
                    </View>
                </View>  
            )
        } else {
            return(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{color: "white", fontWeight: "bold",}}>Loading...</Text>
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

const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
    main: { 
        height: height, 
        width: width, 
        flex: 1, 
        alignItems: 'center', 
        backgroundColor: '#782F40', 
    },
    logo: {
        width: 200, 
        height: 200, 
        //backgroundColor: '#CEB888', 
        justifyContent: "center", 
        alignItems: "center", 
        marginTop: 50 
    },
    name: {
        fontWeight: 'bold',
        fontSize: 32,
        color: "#fff"
    },
    fsuid: {
        //fontWeight: '',
        fontSize: 18,
        color: "#fff"
    },
    spacer: {
        height: 20,
    },
    address: {
        fontWeight: 'bold',
        fontSize: 32,
        color: "#fff"
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    },
    login: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#CEB888",
        height: height/3,
        width: width,
        borderTopColor: "#2C2A29",
        borderTopWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
});