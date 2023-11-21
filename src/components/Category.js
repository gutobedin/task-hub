import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import commonStyles from "../commonStyles";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/pt-br";
import Swipeout from "react-native-swipeout";
import TaskList from "../screens/TaskList";
import { showError } from "../common";
import axios from "axios";

export default (props) => {
  const doneOrNotStyle =
    props.doneAt != null ? { textDecorationLine: "line-through" } : {};

  const date = props.doneAt ? props.doneAt.date : props.estimateAt;
  const [showTasks, setShowtasks] = useState(false);
  const formattedDate = moment(date)
    .locale("pt-br")
    .format("ddd, D [de] MMMM");

  const swipeoutBtns = [
    {
      text: null,
      component: (
        <View style={styles.deleteButton}>
          <FontAwesome name="trash" size={25} color="#fff" />
        </View>
      ),
      backgroundColor: "red",
      onPress: () => {
        props.deleteCategory(props.id);
        console.log("Item excluído");
      },
    },
  ];

  const toggleTasks = () => {
    setShowtasks(!showTasks);
  };

  return (
    <Swipeout right={swipeoutBtns}>
      <TouchableWithoutFeedback onPress={() => toggleTasks()}>
        <View style={styles.container}>
          <View style={styles.checkConntainer}>
            <FontAwesome name="folder" size={23} />
          </View>
          <View>
            <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {showTasks && (
        <TaskList
          showDoneTasks={props.showDoneTasks}
          token={props.token}
          categoryId={props.id}
          daysAhead={props.daysAhead}
          reloadTasks={props.reloadTasks}
        />
      )}
    </Swipeout>
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
    width: "100%",
    flexDirection: "row",
    borderColor: "#AAA",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FFF",
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
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
