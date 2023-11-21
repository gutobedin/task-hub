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
import Category from "../components/Category";
import AddCategory from "./addCategory";

export default function CategoryList(props) {
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = props.token.params.token;

  const todayImage = require("../../assets/imgs/today.jpg");
  const tomorrowImage = require("../../assets/imgs/tomorrow.jpg");
  const weekImage = require("../../assets/imgs/week.jpg");
  const monthImage = require("../../assets/imgs/month.jpg");
  const today = moment()
    .locale("pt-br")
    .format("ddd, D [de] MMMM");

  const loadCategories = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${server}/categories`, {
        headers,
      });

      setCategories(response.data);
    } catch (e) {
      showError(e);
    }
  };

  console.log("categorias", categories);

  const deleteCategory = async (id) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      await axios.delete(`${server}/categories/${id}`, { headers });
      loadCategories();
    } catch (err) {
      showError(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, [showDoneTasks])
  );

  const toggleFilter = () => {
    setShowDoneTasks(!showDoneTasks);
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
          categoryId: newTask.categoryId,
        },
        { headers }
      );
      setShowAddTask(false);
      loadCategories();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (err) {
      showError("Preencha todos os campos");
    }
  };
  const addCategory = async (newTask) => {
    if (!newTask.desc) {
      Alert.alert("Dados inválidos", "Descrição não informada");
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      await axios.post(
        `${server}/categories`,
        {
          desc: newTask.desc,
        },
        { headers }
      );
      setShowAddCategory(false);
      loadCategories();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (err) {
      showError("Preencha todos os campos");
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

  return (
    <View>
      <AddTask
        token={token}
        daysAhead={props.daysAhead}
        isVisible={showAddTask}
        onSave={addTask}
        categories={categories}
        onCancel={() => setShowAddTask(false)}
        onUpdate={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
      <AddCategory
        token={token}
        daysAhead={props.daysAhead}
        isVisible={showAddCategory}
        onSave={addCategory}
        onCancel={() => setShowAddCategory(false)}
        onUpdate={() => setRefreshKey((prevKey) => prevKey + 1)}
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
      <View key={refreshKey} style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <Category
              deleteCategory={deleteCategory}
              {...item}
              showDoneTasks={showDoneTasks}
              token={token}
              key={refreshKey}
              daysAhead={props.daysAhead}
            />
          )}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          categories[0]?.desc
            ? { backgroundColor: getColor() }
            : { backgroundColor: "grey" },
        ]}
        onPress={() => setShowAddTask(true)}
        activeOpacity={0.7}
        disabled={categories[0]?.desc ? false : true}
      >
        <FontAwesome
          name="plus"
          size={25}
          color={commonStyles.colors.seconday}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addCategory, { backgroundColor: getColor() }]}
        onPress={() => setShowAddCategory(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.textCategory}>Nova categoria</Text>
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
  addCategory: {
    position: "absolute",
    left: 30,
    padding: 14,
    bottom: 30,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    alignItems: "center",
    justifyContent: "center",
  },
  textCategory: {
    fontSize: 16,
    color: "white",
  },
});
