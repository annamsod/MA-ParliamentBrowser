import { ListItem, Avatar } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { SearchBarComponent } from "./SearchBar";

export const HomeScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const getPersonsFromAPI = async () => {
    try {
      let sittingMembers = [];
      let offset = 0;
      const limit = 50;

      //Fetch all the persons from the API 50 at a time
      while (true) {
        const response = await fetch(
          `https://api.lagtinget.ax/api/persons?limit=${limit}&offset=${offset}`
        );
        const json = await response.json();
        //Filter the data to only get the sitting members (State=1)
        const newMembers = json.filter((person) => person.state === "1");
        sittingMembers = [...sittingMembers, ...newMembers];
        offset += limit;
        if (json.length < limit) {
          break;
        }
      }
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

  //Filter the data according to the search criteria
  const filteredData = data.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  //Show a list with the persons picture (if existing) and name
  return (
    <View style={{ flex: 1, padding: 24 }}>
      {!isLoading && ( // Render SearchBarComponent only if not loading
        <SearchBarComponent setSearch={setSearch} search={search} />
      )}
      {isLoading ? ( //Show an activity indicator while the data is beeing fetched
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Detaljvy", { person: item })}
            >
              <ListItem bottomDivider>
                {item.image && item.image.url ? ( //If the person have an image use that otherwise a generic icon
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
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
