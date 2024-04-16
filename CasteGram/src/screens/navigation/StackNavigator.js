//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Login/LoginScreen';
import OTPVerification from '../Login/OtpVerification';
// import Introduction from '../Introduction/Introduction';


// create a component
const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <View style={styles.container}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} >
                <Stack.Screen name="LoginScreen" component={LoginScreen}></Stack.Screen>
                <Stack.Screen name="OTPVerification" component={OTPVerification}></Stack.Screen>
             



                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default StackNavigator;
