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
  const [showAddTask, setShowAddTask] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({ days: props.daysAhead })
        .format("YYYY-MM-DD 23:59:59");

      const headers = {
        Authorization: `Bearer ${props.token}`,
      };

      const response = await axios.get(
        `${server}/categories/${props.categoryId}/tasks/${maxDate}`,
        {
          headers,
        }
      );
      setTasks(response.data);
    } catch (e) {
      showError(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [props.showDoneTasks])
  );
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  console.log("propsTask", props);
  const filterTasks = () => {
    let visibleTasks = null;
    if (props.showDoneTasks === true) {
      visibleTasks = [...tasks];
    } else {
      const pending = (task) => task.doneAt === null;
      visibleTasks = tasks.filter(pending);
    }

    setVisibleTasks(visibleTasks);
  };

  console.log("propsssss", visibleTasks);
  useEffect(() => {
    filterTasks();
  }, [tasks]);

  return (
    <View>
      <View style={styles.container}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <Task {...item} token={props.token} setTasks={setTasks} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
