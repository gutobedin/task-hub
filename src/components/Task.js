import React from "react";
import axios from "axios";
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
import { server, showError } from "../common";

export default (props) => {
  const doneOrNotStyle =
    props.doneAt != null ? { textDecorationLine: "line-through" } : {};

  const date = props.doneAt ? props.doneAt.date : props.estimateAt;
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
        deleteTask(props.id);
        console.log("Item excluído");
      },
    },
  ];

  const toggleTask = async (taskId) => {
    const headers = {
      Authorization: `Bearer ${props.token}`,
    };

    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`, {}, { headers });

      // Atualiza o estado das tarefas
      props.setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, doneAt: task.doneAt ? null : new Date() };
          }
          return task;
        })
      );
    } catch (err) {
      showError(err);
    }
  };

  const deleteTask = async (id) => {
    const headers = {
      Authorization: `Bearer ${props.token}`,
    };
    try {
      await axios.delete(`${server}/tasks/${id}`, { headers });

      // Atualiza o estado de tasks removendo a tarefa com o ID correspondente
      props.setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Swipeout right={swipeoutBtns}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => toggleTask(props.id)}>
          <View style={styles.checkConntainer}>
            {getCheckView(props.doneAt)}
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
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
