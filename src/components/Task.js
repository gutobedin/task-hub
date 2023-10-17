import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import commonStyles from "../commonStyles";
import { FontAwesome } from "@expo/vector-icons";

import moment from "moment";
import "moment/locale/pt-br";

export default (props) => {
  const doneOrNotStyle =
    props.doneAt != null ? { textDecorationLine: "line-through" } : {};

  const date = props.doneAt ? props.doneAt.date : props.estimateAt;
  const formattedDate = moment(date)
    .locale("pt-br")
    .format("ddd, D [de] MMMM");
  return (
    <View style={styles.container}>
      <View style={styles.checkConntainer}>{getCheckView(props.doneAt)}</View>
      <View>
        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );

  function getCheckView(doneAt) {
    if (doneAt != null) {
      return (
        <View style={styles.done}>
          <FontAwesome name="check" size={20} color="#fff" />
        </View>
      );
    } else {
      return <View style={styles.pending} />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "#AAA",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  checkConntainer: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#555",
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: "#4D7031",
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    color: commonStyles.colors.mainText,
    fontSize: 15,
  },
  date: {
    fontFamily: "Times New Roman",
    color: commonStyles.colors.subText,
    fontSize: 13,
  },
});
