import { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator } from "react-native";

export const DetailScreen = ({ route, navigation }) => {
  const { person } = route.params;
  const [age, setAge] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMoreDataFromAPI = async () => {
    try {
      const response = await fetch(
        `https://api.lagtinget.ax/api/persons/${person.id}`
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error loading data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMoreDataFromAPI();
  }, []);

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
    const personAge = calculateAge();
    setAge(personAge);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <View
            style={{
              width: "80%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {person.image && person.image.url ? (
              <Image
                style={{ width: "100%", aspectRatio: 1 }}
                source={{ uri: person.image.url }}
              />
            ) : (
              <Image
                style={{ width: "100%", aspectRatio: 1 }}
                source={require("./icon.png")}
              />
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Namn:</Text>
            <Text>{person.name}</Text>
          </View>
          {person.address !== "" && (
            <View style={styles.row}>
              <Text style={styles.label}>Adress:</Text>
              <Text>{person.address}</Text>
            </View>
          )}
          {person.city !== "" && (
            <View style={styles.row}>
              <Text style={styles.label}>Kommun:</Text>
              <Text>{person.city}</Text>
            </View>
          )}
          {person.birthday !== "" && (
            <View style={styles.row}>
              <Text style={styles.label}>Födelsedag:</Text>
              <Text>{person.birthday}</Text>
            </View>
          )}
          {age !== null && (
            <View style={styles.row}>
              <Text style={styles.label}>Ålder:</Text>
              <Text>{age}</Text>
            </View>
          )}
          {data.profession !== "" && (
            <View style={styles.row}>
              <Text style={styles.label}>Yrke:</Text>
              <Text>{data.profession}</Text>
            </View>
          )}
          {data.phone !== "" && (
            <View style={styles.row}>
              <Text style={styles.label}>Telefon:</Text>
              <Text>{data.phone}</Text>
            </View>
          )}
          {data.email !== "" && (
            <View style={styles.row}>
              <Text style={styles.label}>E-mail:</Text>
              <Text>{data.email}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

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
