import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import backgroundImage from "../../assets/imgs/login.jpg";
import commonStyles from "../commonStyles";
import AuthInput from "../components/AuthInput";
import { useNavigation } from "@react-navigation/native";

import { server, showError, showSuccess } from "../common";
import axios from "axios";

export default function Auth() {
  const [email, setEmail] = useState("gutoobedin@gmail.com");
  const [password, setPassword] = useState("123321");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stageNew, setStageNew] = useState(false);
  const navigation = useNavigation();

  signinOrSignup = () => {
    if (stageNew) {
      signup();
    } else {
      signin();
    }
  };

  signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });

      showSuccess("Usuário cadastrado");
      setStageNew(false);
      setEmail("");
      setPassword("");
    } catch (e) {
      showError(e);
    }
  };

  const signin = async () => {
    try {
      const response = await axios.post(`${server}/signin`, {
        email: email,
        password: password,
      });

      const tokenString = response.data.token.toString();
      console.log("Token recebido:", tokenString);

      navigation.navigate("Home", {
        screen: "Hoje",
        params: {
          token: tokenString,
          name: response.data.name,
          email: response.data.email,
        },
      });
      setEmail("");
      setPassword("");
    } catch (e) {
      Alert.alert(
        "Ops! Ocorreu um Problema!",
        `Mensagem: Usuário ou senha inválidos`
      );
    }
  };

  const validations = [];
  validations.push(email && email.includes("@"));
  validations.push(password && password.length >= 6);

  if (stageNew) {
    validations.push(name && name.trim().length >= 3);
    validations.push(password === confirmPassword);
  }

  const validForm = validations.reduce((t, a) => t && a);

  return (
    <KeyboardAvoidingView behavior="padding" enabled>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.formContainer}>
          <Text style={styles.subTitle}>
            {stageNew ? "Crie a sua conta" : "Informe seus dados"}
          </Text>
          {stageNew && (
            <AuthInput
              icon="user"
              placeholder="Nome"
              value={name}
              style={styles.input}
              onChangeText={(name) => setName(name)}
            />
          )}
          <AuthInput
            icon="at"
            placeholder="E-mail"
            value={email}
            style={styles.input}
            onChangeText={(email) => setEmail(email)}
          />
          <AuthInput
            icon="lock"
            placeholder="Senha"
            value={password}
            style={styles.input}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
          {stageNew && (
            <AuthInput
              icon="asterisk"
              placeholder="Confirmar senha"
              value={confirmPassword}
              style={styles.input}
              onChangeText={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              secureTextEntry={true}
            />
          )}
          <TouchableOpacity onPress={signinOrSignup} disabled={!validForm}>
            <View
              style={[
                styles.button,
                validForm ? {} : { backgroundColor: "#AAA" },
              ]}
            >
              <Text style={styles.buttonText}>
                {stageNew ? "Registrar" : "Entrar"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => setStageNew(!stageNew)}
        >
          <Text style={styles.buttonText2}>
            {stageNew ? "Já possui conta?" : "Ainda não possui conta?"}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.seconday,
    fontSize: 70,
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    width: "90%",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#FFF",
    padding: 15,
  },
  button: {
    backgroundColor: "#080",
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  buttonText2: {
    color: "#fff",
    fontSize: 14,
  },
});
