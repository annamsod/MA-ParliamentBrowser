import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ListItem, Avatar, SearchBar } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

function SearchBarComponent({ setSearch, search }) {
  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Sök ledamot"
        onChangeText={updateSearch}
        value={search}
        lightTheme
      />
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const getPersonsFromAPI = async () => {
    try {
      let sittingMembers = [];
      let offset = 0;
      const limit = 50;

      while (true) {
        const response = await fetch(
          `https://api.lagtinget.ax/api/persons?limit=${limit}&offset=${offset}`
        );
        const json = await response.json();
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

  const filteredData = data.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {!isLoading && ( // Render SearchBarComponent only if not loading
        <SearchBarComponent setSearch={setSearch} search={search} />
      )}
      {isLoading ? (
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
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function DetailView({ route, navigation }) {
  const { person } = route.params;
  const [age, setAge] = useState(null);

  const calculateAge = () => {
    const birthday = new Date(person.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    // Calculate the age when the component mounts
    const personAge = calculateAge();
    setAge(personAge);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{ width: "80%", alignItems: "center", justifyContent: "center" }}
      >
        {person.image && person.image.url ? (
          <Image
            style={{ width: "100%", aspectRatio: 1 }} // Adjust the size as needed
            source={{ uri: person.image.url }}
          />
        ) : (
          <Image
            style={{ width: "100%", aspectRatio: 1 }} // Adjust the size as needed
            source={require("./icon.png")}
          />
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Namn: </Text>
        <Text>{person.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Adress: </Text>
        <Text>{person.address}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kommun: </Text>
        <Text>{person.city}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Födelsedag: </Text>
        <Text>{person.birthday}</Text>
      </View>
      {age !== null && (
        <View style={styles.row}>
          <Text style={styles.label}>Ålder: </Text>
          <Text>{age}</Text>
        </View>
      )}
    </View>
  );
}

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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  view: {
    margin: 10,
  },
});
