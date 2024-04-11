import { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export const DetailView = ({ route, navigation }) => {
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
