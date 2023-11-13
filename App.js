import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import Auth from "./src/screens/Auth";
import TaskList from "./src/screens/TaskList";
import { Text, TouchableOpacity, View } from "react-native";
import { Gravatar } from "react-native-gravatar";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { name, email } = props;
  return (
    <DrawerContentScrollView {...props}>
      {/* Adicionar um cabeçalho personalizado */}
      <View
        style={{
          padding: 16,
          backgroundColor: "#F5F5F5",
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View>
          <Gravatar
            style={{ borderRadius: 30 }}
            options={{
              email: email,
              secure: true,
            }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "#333" }}>
            {name}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
            {email}
          </Text>
        </View>
      </View>
      {/* Personalize os itens conforme necessário */}
      <CustomDrawerItem
        label="Hoje"
        onPress={() => props.navigation.navigate("Hoje")}
        selected={props.state.routeNames.includes("Hoje")}
      />
      <CustomDrawerItem
        label="Amanhã"
        onPress={() => props.navigation.navigate("Amanhã")}
        selected={props.state.routeNames.includes("Amanhã")}
      />
      <CustomDrawerItem
        label="Semana"
        onPress={() => props.navigation.navigate("Semana")}
        selected={props.state.routeNames.includes("Semana")}
      />
      <CustomDrawerItem
        label="Mês"
        onPress={() => props.navigation.navigate("Mês")}
        selected={props.state.routeNames.includes("Mês")}
      />

      {/* Adicione um item personalizado de sair, por exemplo */}
      <CustomDrawerItem
        label="Sair"
        onPress={() => props.navigation.navigate("Auth")}
        style={{ color: "red", marginTop: 60 }}
      />
    </DrawerContentScrollView>
  );
};

const CustomDrawerItem = ({ label, onPress, selected, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          padding: 16,
          fontSize: 16,
          ...style, // Adiciona estilos personalizados
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const DrawerNavigator = ({ route }) => {
  const { params } = route;
  const name = params.params.name || null;
  const email = params.params.email || null;
  const initialToken = route.params;
  const [token, setToken] = useState(initialToken);

  const createTaskListScreen = (title, daysAhead) => (props) => (
    <TaskList title={title} daysAhead={daysAhead} token={token} {...props} />
  );

  return (
    <Drawer.Navigator
      initialRouteName="Hoje"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} name={name} email={email} />
      )}
    >
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Hoje"
        component={createTaskListScreen("Hoje", 0)}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Amanhã"
        component={createTaskListScreen("Amanhã", 1)}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Semana"
        component={createTaskListScreen("Semana", 7)}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Mês"
        component={createTaskListScreen("Mês", 30)}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Home"
          component={DrawerNavigator}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Auth"
          component={Auth}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
