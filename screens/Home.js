import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";

import {
  databaseExists,
  addMenuItems,
  displayMenuItems,
  createTable,
  getMenuItems,
  saveMenuItems,
  dropTable,
  queryBySearchAndCategory,
} from "../database/database";

import { useUpdateEffect } from "../utils";

const Home = ({ navigation }) => {
  const [menuItems, setMenuItems] = React.useState(null);
  const [menuExists, setMenuExists] = React.useState(null);

  const [filterSelections, setFilterSelections] = React.useState([]);
  const [sections, setSections] = React.useState(null);

  const [searchQuery, setSearchQuery] = React.useState("");

  const getMenuFromAPI = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const json = await response.json();
      return json;
      //   if (json !== null) {
      //     setMenuItems(json.menu);
      //   }
      // for (const item of json.menu) {
      //   console.log(item);
      // }
      // console.log(json.menu);
      //   }
    } catch (e) {}
  };

  React.useEffect(() => {
    (async () => {
      try {
        // await dropTable();
        await createTable();
        let items = await getMenuItems();
        // console.log("Getting items from db:", items);
        if (!items.length) {
          console.log("Nothing in DB, fetching data from API and saving.");
          const json = await getMenuFromAPI();
          if (json !== null) {
            // setMenuItems(json.menu);
            //await dropTable();
            const items = json.menu;
            saveMenuItems(items);
          }
        }
        {
          console.log("Retrieved from database");
        }
        const cats = new Set(
          items.map((item) => {
            return item.category;
          })
        );
        const categories = new Array(...cats);
        console.log(categories);
        setSections(categories);
        setFilterSelections(categories.map(() => false));
        // console.log(filterSelections);
        setMenuItems(items);
      } catch (e) {}
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const selectedCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      console.log(selectedCategories, "FROM USE UPDATE");
      try {
        console.log("Changing: ", searchQuery, selectedCategories);
        const menuItems = await queryBySearchAndCategory(
          searchQuery,
          selectedCategories
        );
        // console.log("New items:", menuItems);
        // const sectionListData = getSectionListData(menuItems);
        // setData(sectionListData);
        setMenuItems(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, searchQuery]);

  function MenuItem(props) {
    return (
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          {props.obj.name}
        </Text>
        <Text>{menuExists}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 3,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginTop: 10 }}>{props.obj.description}</Text>

            <Text style={{ fontSize: 18 }}>${props.obj.price}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              style={{ height: 100, width: 100 }}
              source={{
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${props.obj.image}?raw=true`,
              }}
            ></Image>
          </View>
        </View>
        <View
          style={{
            marginVertical: 10,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    );
  }

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <View style={{ flex: 1, marginTop: 40 }}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Logo.png")}
          style={styles.headerImage}
        ></Image>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: pressed ? "white" : "#495E57" },
            styles.profileButton,
          ]}
          onPress={() => {
            navigation.push("Profile");
          }}
        >
          <Text style={{ fontSize: 18, color: "grey" }}>Profile</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 2,
          justifyContent: "space-between",
          backgroundColor: "#495E57",
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 36,
              marginHorizontal: 20,
              color: "yellow",
            }}
          >
            Little Lemon
          </Text>
          <Text style={{ fontSize: 24, marginHorizontal: 20, color: "white" }}>
            Chicago
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flexShrink: 1,
              fontSize: 18,
              margin: 20,
              color: "white",
            }}
          >
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>

          <Image
            source={require("../assets/home_image.jpg")}
            style={{
              height: 150,
              width: 100,
              marginHorizontal: 10,
              borderRadius: 16,
            }}
          ></Image>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ color: "white" }}>Search</Text>
          <TextInput
            style={{
              height: 30,
              backgroundColor: "lightgrey",
              borderRadius: 5,
            }}
            onChangeText={setSearchQuery}
          ></TextInput>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        {/* {console.log(filterSelections, filterSelections === null)} */}
        {sections !== null ? (
          <FlatList
            horizontal={true}
            data={sections}
            renderItem={({ item, index }) => (
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 16,
                  borderWidth: 1,
                  backgroundColor: filterSelections[index]
                    ? "#EE9972"
                    : "#495E57",
                }}
                onPress={() => {
                  handleFiltersChange(index);
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            )}
          ></FlatList>
        ) : (
          <View>
            <Text>FAILED TO LOAD LIST</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 3 }}>
        <FlatList
          data={menuItems}
          renderItem={({ item }) => <MenuItem obj={item} />}
          // keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerImage: {
    height: 75,
    width: 200,
    resizeMode: "contain",
    // borderWidth: 1,
    // borderColor: "red",
  },
  profileButton: {
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    alignSelf: "center",
  },
});
