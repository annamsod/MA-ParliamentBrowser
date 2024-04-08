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
            <Text>
              {item.name}, {item.id}
            </Text>
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
