//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StackNavigator from './src/screens/navigation/StackNavigator';

// create a component
const App = () => {
  return (
    <View style={styles.container}>
   
      <StackNavigator/>

    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:'center',
    backgroundColor: 'white',
    
  },
});

//make this component available to the app
export default App;
