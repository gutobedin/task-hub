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

import moment from "moment";
import "moment/locale/pt-br";

import Task from "../components/Task";
import AddTask from "./addTask";

export default function App() {
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [tasks, setTasks] = useState([
    {
      id: Math.random(),
      desc: "Comprar Livro de React Native",
      estimateAt: new Date(),
      doneAt: new Date(),
    },
    {
      id: Math.random(),
      desc: "Ler Livro de React Native",
      estimateAt: new Date(),
      doneAt: null,
    },
  ]);
  const [updateCounter, setUpdateCounter] = useState(0);

  const todayImage = require("../../assets/imgs/today.jpg");
  const today = moment()
    .locale("pt-br")
    .format("ddd, D [de] MMMM");

  useEffect(() => {
    filterTasks();
  }, [showDoneTasks, updateCounter]);

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

  const toggleTask = (taskId) => {
    const updatedTasks = [...tasks];
    updatedTasks.forEach((task) => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });

    setTasks(updatedTasks);
    setUpdateCounter(updateCounter + 1);
  };

  const addTask = (newTask) => {
    if (!newTask.desc) {
      Alert.alert("Dados inválidos", "Descrição não informada");
      return;
    }
    const updatedTasks = [...tasks];
    updatedTasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null,
    });

    setTasks(updatedTasks);
    setShowAddTask(false);
    setUpdateCounter(updateCounter + 1);
  };

  const deleteTask = (id) => {
    console.log("tasks", tasks);
    const filterTask = tasks.filter((task) => task.id !== id);
    setTasks(filterTask);
    setUpdateCounter(updateCounter + 1);
  };

  return (
    <View>
      <AddTask
        isVisible={showAddTask}
        onSave={addTask}
        onCancel={() => setShowAddTask(false)}
      />
      <ImageBackground
        resizeMode="cover"
        source={todayImage}
        style={styles.Image}
      >
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={toggleFilter}>
            <FontAwesome
              name={showDoneTasks ? "eye" : "eye-slash"}
              size={25}
              color={commonStyles.colors.seconday}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subTitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.container}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => `${item.id}${updateCounter}`}
          renderItem={({ item }) => (
            <Task {...item} toggleTask={toggleTask} onDelete={deleteTask} />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
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
    justifyContent: "flex-end",
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
