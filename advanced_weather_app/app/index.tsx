import React, { useState } from "react";
import { Text, PaperProvider, MD3LightTheme } from "react-native-paper";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CButton from "./CButton";
import CAppbar from "./CAppbar";

export default function App() {
  const [state, setState] = useState(true);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <PaperProvider theme={MD3LightTheme}>
          <CAppbar />
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
