import * as React from "react";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Button,
  Alert,
} from "react-native";

import Checkbox from "expo-checkbox";

import { LoggedInContext } from "../context/logged-in-context";
// import { LoggedInContext } from "./context/logged-in-context.js";
// import ProfileImagePicker from "../components/ImagePicker";

import * as ImagePicker from "expo-image-picker";

function validateName(text) {
  return /^[a-zA-Z]+$/.test(text);
}

function validateEmail(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(email);
}

const Profile = ({ route }) => {
  const { onboarded, setOnboarded } = React.useContext(LoggedInContext);
  console.log(onboarded, setOnboarded);
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [emailSettings, setEmailSettings] = React.useState(null);

  const [orderStatus, setOrderStatus] = React.useState(false);
  const [passwordChanges, setPasswordChanges] = React.useState(false);
  const [specialOffers, setSpecialOffers] = React.useState(false);
  const [newsletter, setNewsletter] = React.useState(false);

  const [image, setImage] = React.useState(null);
  const [buttonName, setButtonName] = React.useState("Add Photo");

  //   const { logoutFunction } = route;

  function validateName(text) {
    return /^[a-zA-Z]+$/.test(text);
  }

  function validateEmail(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(email);
  }

  function validatePhoneNumber(number) {
    return /^[0-9]{10}$/.test(number);
  }

  React.useEffect(() => {
    (async () => {
      try {
        // Getting first name, last name, email, phone number
        const userInfo = await AsyncStorage.getItem("user-info");
        const json = JSON.parse(userInfo);
        if (json !== null) {
          setFirstName(json.name ?? "");
          setEmail(json.email ?? "");
          setLastName(json.lastName ?? "");
          setPhoneNumber(json.phoneNumber ?? "");
        }

        // Getting Email Notification Settings
        const settings = await AsyncStorage.getItem("email-settings");
        const jsonEmailSettings = JSON.parse(settings);
        //console.log(jsonEmailSettings, jsonEmailSettings["order-status"]);
        if (jsonEmailSettings === null) {
          setOrderStatus(false);
          setPasswordChanges(false);
          setSpecialOffers(false);
          setNewsletter(false);
        } else {
          console.log("Email status:", jsonEmailSettings);
          setOrderStatus(jsonEmailSettings["order-status"] ?? false);
          setPasswordChanges(jsonEmailSettings["password-changes"] ?? false);
          setSpecialOffers(jsonEmailSettings["special-offers"] ?? false);
          setNewsletter(jsonEmailSettings["newsletter"] ?? false);
        }

        // Getting Image
        const savedImage = await AsyncStorage.getItem("profile-picture");
        if (savedImage !== null) {
          setImage(savedImage);
          setButtonName("Change");
        }
      } catch (e) {
        console.log("Profile Error", e);
      } finally {
      }
    })();
  }, []);

  async function saveAllFields() {
    try {
      //   if (!validateName(firstName)) {
      //     console.log("FIRST NAME WRONG");
      //   }
      //   if (!validateName(lastName)) {
      //     console.log("LAST NAME WRONG", lastName);
      //   }
      //   if (!validateEmail(email)) {
      //     console.log("EMAIL WRONG");
      //   }

      //   if (!validatePhoneNumber(phoneNumber)) {
      //     console.log("PHONE NUMBER WRONG");
      //   }
      if (
        validateName(firstName) &&
        validateName(lastName) &&
        validateEmail(email) &&
        validatePhoneNumber(phoneNumber)
      ) {
        // Saving first name, last name, email, phone number
        await AsyncStorage.setItem(
          "user-info",
          JSON.stringify({
            name: firstName,
            email: email,
            lastName: lastName,
            phoneNumber: phoneNumber,
          })
        );

        // Saving email notifications
        let obj = {};
        obj["order-status"] = orderStatus;
        obj["password-changes"] = passwordChanges;
        obj["special-offers"] = specialOffers;
        obj["newsletter"] = newsletter;
        await AsyncStorage.setItem("email-settings", JSON.stringify(obj));

        // Saving image
        // await AsyncStorage.removeItem("profile-picture");
        if (image === null) {
          await AsyncStorage.removeItem("profile-picture");
          setButtonName("Add Photo");
        } else {
          await AsyncStorage.setItem("profile-picture", image);
          setButtonName("Change");
        }
        Alert.alert("Information Saved", "");
      } else {
        console.log("An input field is invalid. Not saving data.");
        Alert.alert(
          "Invalid Input",
          "Please enter a valid first name, last name, email, and phone number."
        );
      }
    } catch (e) {
      console.log("Unable to save text input fields.");
    }
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setButtonName("Change");
      }
    } catch (e) {
      console.log("Error picking image.");
    }
  };

  const removePhoto = async () => {
    try {
      //   await AsyncStorage.removeItem("profile-picture");
      setImage(null);
      setButtonName("Add Photo");
    } catch (e) {
      console.log("Unable to remove profile picture from Async.");
    }
  };

  async function logout() {
    try {
      await AsyncStorage.clear();
      setOnboarded(false);
    } catch (e) {
      console.log("Unable to logout.", e);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {/* <Text>Back</Text> */}
        <Image
          source={require("../assets/Logo.png")}
          style={{
            height: 75,
            width: 200,
            marginTop: 10,
            resizeMode: "contain",
          }}
        ></Image>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 50, height: 50, borderRadius: 16 }}
          ></Image>
        ) : (
          <Text>Picture</Text>
        )}
        {/* <Text>Profile Picture</Text> */}
      </View>
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>Personal Information</Text>
        <Text style={{ marginLeft: 20 }}>Avatar</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginLeft: 20,
          }}
        >
          {/* Need to implement image picker*/}
          {/* <ProfileImagePicker /> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 50, height: 50, borderRadius: 16 }}
              ></Image>
            )}
            <Button title={buttonName} onPress={pickImage} />
            <Button title="Remove" onPress={removePhoto} />
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          <Text>First name</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={firstName}
            onChangeText={(newFirstName) => {
              setFirstName(newFirstName);
            }}
          ></TextInput>
        </View>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          <Text>Last name</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={lastName}
            onChangeText={(newLastName) => {
              setLastName(newLastName);
            }}
          ></TextInput>
        </View>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          <Text>Email</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={email}
            onChangeText={(newEmail) => {
              setEmail(newEmail);
            }}
          ></TextInput>
        </View>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
          <Text>Phone number</Text>
          <TextInput
            style={styles.textInput}
            // keyboardType="phone-pad"
            maxLength={10}
            defaultValue={phoneNumber}
            onChangeText={(newNumber) => {
              console.log(newNumber);
              setPhoneNumber(newNumber);
            }}
          ></TextInput>
        </View>
      </View>
      <View style={styles.body2}>
        {/* <View style={{ marginHorizontal: 20 }}> */}
        <Text style={styles.subtitle}>Email notifications</Text>
        <View style={styles.checkBox}>
          <Checkbox
            style={{}}
            value={orderStatus}
            onValueChange={(newStatus) => {
              setOrderStatus(newStatus);
            }}
            color={false ? "#4630EB" : undefined}
          />
          <Text style={{ marginLeft: 10 }}>Order status</Text>
        </View>
        <View style={styles.checkBox}>
          <Checkbox
            style={{}}
            value={passwordChanges}
            onValueChange={(newStatus) => {
              setPasswordChanges(newStatus);
            }}
            color={false ? "#4630EB" : undefined}
          />
          <Text style={{ marginLeft: 10 }}>Password changes</Text>
        </View>
        <View style={styles.checkBox}>
          <Checkbox
            style={{}}
            value={specialOffers}
            onValueChange={(newStatus) => {
              setSpecialOffers(newStatus);
            }}
            color={false ? "#4630EB" : undefined}
          />
          <Text style={{ marginLeft: 10 }}>Special offers</Text>
        </View>
        <View style={styles.checkBox}>
          <Checkbox
            style={{}}
            value={newsletter}
            onValueChange={(newStatus) => {
              setNewsletter(newStatus);
            }}
            color={false ? "#4630EB" : undefined}
          />
          <Text style={{ marginLeft: 10 }}>Newsletter</Text>
        </View>
        {/* </View> */}
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          {/* <Pressable
            style={styles.discardChangesButton}
            onPress={() => {
              resetSettings();
            }}
          >
            <Text style={{ margin: 10 }}>Discard Changes</Text>
          </Pressable> */}
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#a3b8a0" : "#3c5438",
                borderRadius: 12,
              },
            ]}
            // [styles.saveChangesButton, { marginLeft: 10 }]
            onPress={() => {
              //   console.log("Saved changes");
              saveAllFields();
            }}
          >
            <Text style={{ color: "white", margin: 10 }}>Save Changes</Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        // style={[styles.logoutButton, backgroundColor:({pressed})]}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "white" : "yellow",
          },
          styles.logoutButton,
        ]}
        onPress={() => {
          console.log("Logout pressed. Clearing Async.");
          logout();
          //   route.logoutFunction();
        }}
      >
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // marginTop: 40,
  },
  subheader: {
    flex: 1,
  },
  subtitle: {
    fontSize: 28,
    marginLeft: 20,
  },
  body: {
    flex: 4,
    // justifyContent: "space-evenly",
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "space-between",
    margin: 10,
  },
  body2: {
    flex: 3,
    // borderWidth: 1,
    // borderColor: "black",
    marginLeft: 20,
    justifyContent: "space-between",
  },
  changeButton: {
    height: 40,
    width: 100,
    borderRadius: 12,
    backgroundColor: "#3c5438",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    height: 40,
    width: 100,
    borderWidth: 1,
    borderColor: "#3c5438",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    borderRadius: 12,

    borderWidth: 1,
    borderColor: "black",
  },
  saveButton: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
  checkBox: {
    flexDirection: "row",
    // marginVertical: 20,
  },
  logoutButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "yellow",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveChangesButton: {
    backgroundColor: "#3c5438",
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
  },
  discardChangesButton: {
    borderColor: "#3c5438",
    borderWidth: 1,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
  },
});
