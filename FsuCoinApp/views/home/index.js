import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { requireNativeViewManager } from '@unimodules/core';

// Constant
const exampleAddress = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'

export class Home extends React.Component {
    render(){
        return(
            <View style={styles.main}>  
                <View>
                    <Image style={styles.logo} source={require('../../assets/FSU_Seal_500x500.png')} />
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: height/15, justifyContent: "flex-start" }}>
                    <Text style={styles.name}>Name</Text>
                    <Text style={styles.address}>{exampleAddress}</Text>
                </View>
                <View style={styles.transfer}>
                    <View style={styles.transButton}>
                        <Text style={styles.send}>Send</Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.transButton}>
                        <Text style={styles.recieve}>Recieve</Text>
                    </View>
                </View>
            </View>  
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
    address: {
        fontWeight: 'bold',
        fontSize: 16,
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
    }
});