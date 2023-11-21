import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import commonStyles from "../commonStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import { useFocusEffect } from "@react-navigation/native";
import { server, showError } from "../common";
import Axios from "axios";

const initialState = {
  desc: "",
};

export default function AddCategory(props) {
  const [categoryState, setCategoryState] = useState({ ...initialState });

  const save = () => {
    const newTask = {
      desc: categoryState.desc,
    };
    props.onSave && props.onSave(newTask);
    setCategoryState({ ...initialState });
  };

  return (
    <Modal
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onCancel}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Nova Categoria</Text>
        <TextInput
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="Informe a categoria..."
          style={styles.input}
          value={categoryState.desc}
          onChangeText={(desc) => setCategoryState({ ...categoryState, desc })}
        />
        <View style={styles.botoes}>
          <TouchableOpacity onPress={props.onCancel} style={styles.button}>
            <Text style={styles.textButton}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={save}>
            <Text style={styles.textButton}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container: {
    backgroundColor: "#FFF",
  },
  selectDropDown: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.seconday,
    textAlign: "center",
    padding: 15,
    fontSize: 18,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    margin: 20,
    marginRight: 30,
    marginLeft: -10,
    padding: 12,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: commonStyles.colors.today,
    borderRadius: 20,
  },
  textButton: {
    color: commonStyles.colors.seconday,
  },
  input: {
    height: 40,
    margin: 10,
    paddingLeft: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 6,
  },
});
