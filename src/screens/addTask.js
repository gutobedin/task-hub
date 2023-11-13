import React, { useState } from "react";
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
import RNDateTimePicker from "@react-native-community/datetimepicker";

const initialState = { desc: "", date: new Date(), showDatePicker: false };

export default function AddTask(props) {
  const [taskState, setTaskState] = useState({ ...initialState });

  const save = () => {
    const newTask = {
      desc: taskState.desc,
      date: taskState.date,
    };
    console.log("newTask", newTask);
    props.onSave && props.onSave(newTask);
    setTaskState({ ...initialState });
  };

  const getDatePicker = () => {
    return (
      <DateTimePicker
        value={taskState.date}
        onChange={(_, date) => setTaskState({ ...taskState, date })}
        mode="date"
        display="spinner"
        themeVariant="light"
      />
    );
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
        <Text style={styles.header}>Nova Tarefa</Text>
        <TextInput
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          placeholder="Informe a descrição..."
          style={styles.input}
          value={taskState.desc}
          onChangeText={(desc) => setTaskState({ ...taskState, desc })}
        />
        {getDatePicker()}
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
