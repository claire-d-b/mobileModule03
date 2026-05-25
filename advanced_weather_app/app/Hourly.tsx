import { useState } from "react";
import CProgressBar from "./CProgressBar";
import { View, Pressable, ScrollView } from "react-native";
import { Text, Icon } from "react-native-paper";
import getWeatherCode, { getWeatherIcons } from "./weatherCodes";
import Slider from "@react-native-community/slider";

export const truncate = (str: string, maxLength: number = 10) =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

interface HourlyProps {
  hourly: {
    time: Date;
    temperature_2m: number | undefined;
    weather_code: number | undefined;
    wind_speed_10m: number | undefined;
  }[];
  // progress: number;
  // onProgressChange?: (progress: number) => void;
}

const HourlyData = ({ hourly }: HourlyProps) => {
  const [progress, setProgress] = useState(0);
  const handlePress = (i: number) => {
    setProgress(i / hourly.length);
    console.log(i / hourly.length);
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%", backgroundColor: "transparent" }}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      >
        {!!hourly.length &&
          hourly.map((h, i) => {
            return (
              <Pressable
                key={`hourly_detailed_${i}`}
                onPress={() => handlePress(i)}
                style={{
                  justifyContent: "center",
                  backgroundColor: `rgba(60, 76, 103, 0.1)`,
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#534DB3" }}>
                  {h.time.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                </Text>
                <Text style={{ color: "#534DB3", fontWeight: "bold" }}>
                  {h.temperature_2m?.toFixed(1)}°C
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Icon source="weather-windy" size={15} color="gray"></Icon>
                  <Text style={{ color: "gray" }}>
                    {h.wind_speed_10m?.toFixed(1)}km/h
                  </Text>
                </View>
                {/* <Text>{truncate(getWeatherCode(h.weather_code), 10)}</Text> */}
                <Icon
                  source={getWeatherIcons(h.weather_code)}
                  color="#534DB3"
                  size={20}
                />
              </Pressable>
            );
          })}
      </ScrollView>
      <CProgressBar progress={progress} color={"#534DB3"} />
    </View>
  );
};

export default HourlyData;
