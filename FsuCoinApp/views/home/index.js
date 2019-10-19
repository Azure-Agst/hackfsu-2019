import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class Home extends React.Component {
    render(){
        return(
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Hello, world! :)</Text>
            </View>
        )
    }
}