import { SearchBar } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

export const SearchBarComponent = ({ setSearch, search }) => {
  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  return (
    <View>
      <SearchBar
        placeholder="Sök ledamot"
        onChangeText={updateSearch}
        value={search}
        lightTheme
      />
    </View>
  );
};
