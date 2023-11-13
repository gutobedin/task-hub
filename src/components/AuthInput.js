import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <FontAwesome name={props.icon} size={18} style={styles.icon} />
      <TextInput {...props} style={styles.input} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    backgroundColor: "#EEE",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#333",
    height: 20,
  },
  input: {
    height: 30,

    marginLeft: 20,
    width: "70%",
  },
});
