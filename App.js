import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const App = () => {

  _testFirebase = () => {
    firebase.firestore().collection("test").doc("1").set({
      id: 2,
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>Ciao</Text>
        <Button onPress={_testFirebase} title="prova"></Button>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

});

export default App;
