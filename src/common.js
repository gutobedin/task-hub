import { Alert } from "react-native";

const server = "http://192.168.0.227:3000";

function showError(err) {
  Alert.alert("Ops! Ocorreu um Problema!", `Mensagem: ${err}`);
}

function showSuccess(msg) {
  Alert.alert("Sucesso!", msg);
}

export { server, showError, showSuccess };
