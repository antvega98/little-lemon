import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";

import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileImagePicker() {
  const [image, setImage] = useState(null);
  const [buttonName, setButtonName] = useState("Add Photo");

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
        await AsyncStorage.setItem("profile-picture", result.assets[0].uri);
      }
    } catch (e) {
      console.log("Error picking image.");
    }
  };

  const removePhoto = async () => {
    try {
      await AsyncStorage.removeItem("profile-picture");
      setImage(null);
      setButtonName("Add Photo");
    } catch (e) {
      console.log("Unable to remove profile picture from Async.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const savedImage = await AsyncStorage.getItem("profile-picture");
        if (savedImage !== null) {
          setImage(savedImage);
          setButtonName("Change");
        }
      } catch (e) {
        console.log("Unable to get profile picture from Async.");
      }
    })();
  });

  return (
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
  );
}
