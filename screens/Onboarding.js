import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoggedInContext } from "../context/logged-in-context";

function validateName(text) {
  return /^[a-zA-Z]+$/.test(text);
}

function validateEmail(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(email);
}

function Onboarding({ navigation }) {
  const [name, setName] = React.useState("");
  const [validName, setValidName] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [validEmail, setValidEmail] = React.useState(false);

  const { onboarded, setOnboarded } = React.useContext(LoggedInContext);

  const onboard = async () => {
    try {
      console.log(
        "SAVING THIS INFORMATION:",
        JSON.stringify({ name: name, email: email })
      );
      const json = JSON.stringify(true);
      await AsyncStorage.setItem("onboarded", json);
      await AsyncStorage.setItem(
        "user-info",
        JSON.stringify({ name: name, email: email })
      );
      setOnboarded(true);
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Logo.png")}
          style={{ height: 75, width: 350, marginTop: 10 }}
        ></Image>
      </View>

      <View style={styles.body}>
        <Text style={[styles.headerText, { marginBottom: 25 }]}>
          Let's get to know you
        </Text>
        <Text style={styles.subHeaderText}> First Name </Text>
        <TextInput
          defaultValue=""
          style={styles.input}
          onChangeText={(text) => {
            const isValid = validateName(text);
            setValidName(isValid);
            if (isValid) {
              setName(text);
            }
          }}
        ></TextInput>
        <Text style={styles.subHeaderText}> Email </Text>
        <TextInput
          defaultValue=""
          onChangeText={(text) => {
            const isValid = validateEmail(text);
            setValidEmail(isValid);
            if (isValid) {
              setEmail(text);
            }
          }}
          style={styles.input}
          keyboardType="email-address"
        ></TextInput>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            console.log("Pressed button", name, email);
            onboard();
          }}
          style={[
            styles.button,
            { opacity: !(validName && validEmail) ? 0.1 : 1 },
          ]}
          disabled={!(validName && validEmail)}
        >
          <Text style={styles.subHeaderText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 4,
    backgroundColor: "#c4bfbe",
    justifyContent: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    direction: "rtl",
  },
  headerText: {
    fontSize: 36,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 32,
    textAlign: "center",
  },
  input: {
    height: 40,
    marginHorizontal: 50,
    borderWidth: 1,
    marginBottom: 25,
    borderRadius: 16,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#c4bfbe",
    borderRadius: 16,
    width: 150,
    height: 100,
    margin: 20,
  },
});
