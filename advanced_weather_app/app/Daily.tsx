import { useState } from "react";
import CProgressBar from "./CProgressBar";
import { View, Pressable } from "react-native";
import { Text, Icon } from "react-native-paper";
import getWeatherCode, { getWeatherIcons } from "./weatherCodes";
import Slider from "@react-native-community/slider";

export const truncate = (str: string, maxLength: number = 10) =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

interface DailyProps {
  weekly: {
    time: Date;
    temperature_2m_max: number | undefined;
    temperature_2m_min: number | undefined;
    weather_code: number | undefined;
    wind_speed_10m_max: number | undefined;
  }[];
}

const DailyData = ({ weekly }: DailyProps) => {
  const [progress, setProgress] = useState(0);
  const handlePress = (i: number) => {
    setProgress(i / weekly.length);
    console.log(i / weekly.length);
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 10,
          padding: 10,
          backgroundColor: "transparent",
        }}
      >
        {!!weekly.length &&
          weekly.map((w, i) => {
            return (
              <Pressable
                key={`weekly_${i}`}
                onPress={() => handlePress(i)}
                style={{
                  height: "100%",
                  justifyContent: "center",
                  backgroundColor: `rgba(60, 76, 103, 0.1)`,
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "gray" }}>
                  {w.time.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "numeric",
                  })}
                </Text>
                <Text style={{ color: "#A3273D" }}>
                  {w.temperature_2m_min?.toFixed(1)}°C
                </Text>
                <Text style={{ color: "#3C5EA6" }}>
                  {w.temperature_2m_max?.toFixed(1)}°C
                </Text>
                <Icon
                  source={getWeatherIcons(w.weather_code)}
                  color="gray"
                  size={20}
                />
              </Pressable>
            );
          })}
      </View>
      <CProgressBar progress={progress} color={"#534DB3"} />
    </View>
  );
};

export default DailyData;
