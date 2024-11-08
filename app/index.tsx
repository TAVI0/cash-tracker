import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Sun, Moon, Scale, DollarSign } from "lucide-react-native";
import AccountsScreen from "./AccountsScreen";
import MainScreen from "./MainScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
declare global {
  var AsyncStorage: typeof import('@react-native-async-storage/async-storage').default;
}
function Index() {
  const { theme, toggleTheme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<"main" | "accounts">("main");
  const styles = getStyles(theme);

  const navigateToAccounts = async () => {
    setCurrentScreen("accounts");
  };
  global.AsyncStorage = AsyncStorage;

  return (
    <View style={styles.mainContainer}>
      {currentScreen === "main" ? (
        <MainScreen />
      ) : (
        <AccountsScreen />
      )}

      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleTheme}
        accessibilityLabel={`Cambiar a modo ${
          theme === "light" ? "oscuro" : "claro"
        }`}
      >
        {theme === "light" ? (
          <Moon color="#000" size={24} />
        ) : (
          <Sun color="#FFF" size={24} />
        )}
      </TouchableOpacity>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentScreen("main")}
          accessibilityLabel="Ver ingresos"
        >
          <DollarSign color={theme === "light" ? "#000" : "#FFF"} size={24} />
          <Text style={styles.navButtonText}>Ingresos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={navigateToAccounts}
          accessibilityLabel="Ver Registros"
        >
          <Scale color={theme === "light" ? "#000" : "#FFF"} size={24} />
          <Text style={styles.navButtonText}>Registros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme === "light" ? "#F5F5F5" : "#1A1A1A",
    },
    themeToggle: {
      position: "absolute",
      bottom: 70,
      right: 20,
      padding: 10,
      borderRadius: 20,
      backgroundColor: theme === "light" ? "#E0E0E0" : "#3A3A3A",
    },
    navBar: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: theme === "light" ? "#FFFFFF" : "#2A2A2A",
      paddingVertical: 10,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    navButton: {
      alignItems: "center",
    },
    navButtonText: {
      color: theme === "light" ? "#000" : "#FFF",
      marginTop: 5,
      fontSize: 12,
    },
  });

export default function ThemedIndex() {
  return (
    <ThemeProvider>
      <Index />
    </ThemeProvider>
  );
}