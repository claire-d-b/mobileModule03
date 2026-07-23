import { View, ScrollView } from "react-native";
import { Text, Icon } from "react-native-paper";
import { getWeatherIcons } from "../functions/weatherCodes";

export const truncate = (str: string, maxLength: number = 10) =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

interface HourlyProps {
  hourly: {
    time: Date;
    temperature_2m: number | undefined;
    weather_code: number | undefined;
    wind_speed_10m: number | undefined;
  }[];
}

const HourlyData = ({ hourly }: HourlyProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      style={{ backgroundColor: "transparent" }}
      contentContainerStyle={{ gap: 10, padding: 10, flexDirection: "row" }}
    >
      {!!hourly.length &&
        hourly.map((h, i) => {
          return (
            <View
              key={`hourly_detailed_${i}`}
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
              <Icon
                source={getWeatherIcons(h.weather_code)}
                color="#534DB3"
                size={20}
              />
            </View>
          );
        })}
    </ScrollView>
  );
};

export default HourlyData;
