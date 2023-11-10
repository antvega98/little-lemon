import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Onboarding from "./screens/Onboarding.js";
import Profile from "./screens/Profile.js";
import Home from "./screens/Home.js";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

import { LoggedInContext } from "./context/logged-in-context.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [onboarded, setOnboarded] = React.useState(null);
  const providerValue = { onboarded, setOnboarded };
  console.log("Provider value in APP:", providerValue);

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      try {
        //await AsyncStorage.setItem("onboarded", JSON.stringify(false));
        const value = await AsyncStorage.getItem("onboarded");
        console.log("User onboarded: ", value, typeof JSON.parse(value));
        setOnboarded(JSON.parse(value));
      } catch (e) {
        console.log("Error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 36 }}>Is Loading ...</Text>
      </View>
    );
  }

  return (
    <LoggedInContext.Provider value={providerValue}>
      <NavigationContainer>
        <Stack.Navigator>
          {onboarded !== true ? (
            <Stack.Screen
              options={{ headerShown: false }}
              name="Onboarding"
              component={Onboarding}
            />
          ) : (
            <>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={Home}
              />
              <Stack.Screen
                // options={{ headerShown: false }}
                name="Profile"
                component={Profile}
              />
            </>

            // options={({ navigation }) => ({
            //   headerShown: false,
            //   logoutFunction: () => console.log("LOGOUT FROM PARAM FUNCTION"),
            // })}
            ///>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </LoggedInContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
