import React from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import commonStyles from "../commonStyles";

import moment from "moment";
import "moment/locale/pt-br";

import Task from "../components/Task";

export default function App() {
  const todayImage = require("../../assets/imgs/today.jpg");
  const today = moment()
    .locale("pt-br")
    .format("ddd, D [de] MMMM");

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        source={todayImage}
        style={styles.Image}
      >
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subTitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.container}>
        <Task
          desc="Comprar Livro"
          estimateAt={new Date()}
          doneAt={new Date()}
        />
        <Task desc="Ler livro" estimateAt={new Date()} doneAt={null} />
      </View>
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
});
