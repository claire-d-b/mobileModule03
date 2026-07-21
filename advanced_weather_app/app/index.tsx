import React from "react";
import { ImageBackground } from "react-native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CAppbar from "./CAppbar";

const _ = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top", "bottom", "left", "right"]}
      >
        <PaperProvider theme={MD3LightTheme}>
          <ImageBackground
            source={require("../assets/wallpaper.png")}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            <CAppbar />
          </ImageBackground>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default _;
