import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Post from './src/components/Posts';
import NewPost from './src/components/NewPost';
import PostDetail from './src/components/PostDetail';
import Login from './src/components/Login';

const Stack = createStackNavigator();
const StackLogin = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={Post}/>
      <Stack.Screen name="NewPost" component={NewPost}/>
      <Stack.Screen name="PostDetail" component={PostDetail}/>
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

