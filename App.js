import { ListItem, Avatar } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getPersonsFromAPI = async () => {
    try {
      const response = await fetch("https://api.lagtinget.ax/api/persons.json");
      const json = await response.json();
      const sittingMembers = json.filter((person) => person.state === "1");
      setData(sittingMembers);
    } catch (error) {
      console.error("Error loading data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPersonsFromAPI();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              {item.image && item.image.url ? (
                <Avatar
                  rounded
                  source={{
                    uri: item.image.url,
                  }}
                />
              ) : (
                <Avatar
                  rounded
                  icon={{
                    name: "person-outline",
                    type: "material",
                    size: 26,
                  }}
                  containerStyle={{ backgroundColor: "#c2c2c2" }}
                />
              )}
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
