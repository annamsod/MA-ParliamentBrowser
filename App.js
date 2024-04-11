import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { DetailView } from "./DetailScreen";
import { HomeScreen } from "./HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Alla ledamöter">
        <Stack.Screen name="Alla ledamöter" component={HomeScreen} />
        <Stack.Screen name="Detaljvy" component={DetailView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
