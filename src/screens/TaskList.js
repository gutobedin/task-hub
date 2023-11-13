import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import commonStyles from "../commonStyles";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { server, showError } from "../common";

import moment from "moment";
import "moment/locale/pt-br";

import Task from "../components/Task";
import AddTask from "./addTask";
import { useFocusEffect } from "@react-navigation/native";

export default function TaskList(props) {
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const token = props.token.params.token;

  const todayImage = require("../../assets/imgs/today.jpg");
  const tomorrowImage = require("../../assets/imgs/tomorrow.jpg");
  const weekImage = require("../../assets/imgs/week.jpg");
  const monthImage = require("../../assets/imgs/month.jpg");
  const today = moment()
    .locale("pt-br")
    .format("ddd, D [de] MMMM");

  const loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({ days: props.daysAhead })
        .format("YYYY-MM-DD 23:59:59");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${server}/tasks?date=${maxDate}`, {
        headers,
      });

      setTasks(response.data);
    } catch (e) {
      showError(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();

      // Cleanup function (será chamada quando o componente for desfocado)
      return () => {
        // Coloque aqui qualquer lógica de limpeza, se necessário
      };
    }, [showDoneTasks])
  );

  const toggleFilter = () => {
    setShowDoneTasks(!showDoneTasks);
  };

  const filterTasks = () => {
    let visibleTasks = null;
    if (showDoneTasks) {
      visibleTasks = [...tasks];
    } else {
      const pending = (task) => task.doneAt === null;
      visibleTasks = tasks.filter(pending);
    }

    setVisibleTasks(visibleTasks);
  };

  const toggleTask = async (taskId) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`, {}, { headers });

      // Atualiza o estado das tarefas
      setTasks((prevTasks) =>
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

  const addTask = async (newTask) => {
    if (!newTask.desc) {
      Alert.alert("Dados inválidos", "Descrição não informada");
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      await axios.post(
        `${server}/tasks`,
        {
          desc: newTask.desc,
          estimateAt: newTask.date,
        },
        { headers }
      );
      setShowAddTask(false);
      loadTasks();
    } catch (err) {
      showError(err);
    }
  };

  const deleteTask = async (id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      await axios.delete(`${server}/tasks/${id}`, { headers });

      // Atualiza o estado de tasks removendo a tarefa com o ID correspondente
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      showError(err);
    }
  };

  getImage = () => {
    switch (props.daysAhead) {
      case 0:
        return todayImage;
      case 1:
        return tomorrowImage;
      case 7:
        return weekImage;
      default:
        return monthImage;
    }
  };
  getColor = () => {
    switch (props.daysAhead) {
      case 0:
        return commonStyles.colors.today;
      case 1:
        return commonStyles.colors.tomorrow;
      case 7:
        return commonStyles.colors.week;
      default:
        return commonStyles.colors.month;
    }
  };

  useEffect(() => {
    filterTasks();
  }, [showDoneTasks, tasks]);

  return (
    <View>
      <AddTask
        isVisible={showAddTask}
        onSave={addTask}
        onCancel={() => setShowAddTask(false)}
      />
      <ImageBackground
        resizeMode="cover"
        source={getImage()}
        style={styles.Image}
      >
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
            <FontAwesome
              name={"bars"}
              size={25}
              color={commonStyles.colors.seconday}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFilter}>
            <FontAwesome
              name={showDoneTasks ? "eye" : "eye-slash"}
              size={25}
              color={commonStyles.colors.seconday}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subTitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.container}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <Task {...item} toggleTask={toggleTask} onDelete={deleteTask} />
          )}
        />
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: getColor() }]}
        onPress={() => setShowAddTask(true)}
        activeOpacity={0.7}
      >
        <FontAwesome
          name="plus"
          size={25}
          color={commonStyles.colors.seconday}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Image: {
    width: "100%",
    height: 280,
  },
  titleBar: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.seconday,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.seconday,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  container: {
    height: 520,
  },
  iconBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "space-between",
    marginTop: 40,
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    alignItems: "center",
    justifyContent: "center",
  },
});
