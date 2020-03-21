import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Post from './src/components/Posts';
import NewPost from './src/components/NewPost';
import PostDetail from './src/components/PostDetail';
import SavedPosts from './src/components/SavedPosts';
import Login from './src/components/Login';
import Messaging from './src/components/Messaging';

const Stack = createStackNavigator();
const StackLogin = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={Post}/>
      <Stack.Screen name="NewPost" component={NewPost}/>
      <Stack.Screen name="PostDetail" component={PostDetail}/>
      <Stack.Screen name="SavedPosts" component={SavedPosts}/>
      <Stack.Screen name="Chat" component={Messaging}/>
    </Stack.Navigator>
  );
}

function LoginStack() {
  return (
    <StackLogin.Navigator headerMode="none">
      <StackLogin.Screen name="Login" component={Login}/>
    </StackLogin.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <StackLogin.Navigator headerMode="none">
        <StackLogin.Screen name="Login" component={LoginStack}/>
        <StackLogin.Screen name="MainStack" component={MainStack}/>
      </StackLogin.Navigator>
    </NavigationContainer>
  );
}

export default App;

