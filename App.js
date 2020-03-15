import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Post from './src/components/Posts';
import NewPost from './src/components/NewPost';
import PostDetail from './src/components/PostDetail'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Post}/>
        <Stack.Screen name="NewPost" component={NewPost}/>
        <Stack.Screen name="PostDetail" component={PostDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

