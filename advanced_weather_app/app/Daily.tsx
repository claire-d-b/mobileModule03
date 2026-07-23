import { View, ScrollView } from "react-native";
import { Text, Icon } from "react-native-paper";
import { getWeatherIcons } from "../functions/weatherCodes";

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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      style={{ backgroundColor: "transparent" }}
      contentContainerStyle={{
        gap: 10,
        padding: 10,
        flexDirection: "row",
        height: "100%",
      }}
    >
      {!!weekly.length &&
        weekly.map((w, i) => {
          return (
            <View
              key={`weekly_${i}`}
              style={{
                justifyContent: "center",
                alignItems: "baseline",
                backgroundColor: `rgba(60, 76, 103, 0.1)`,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "gray" }}>
                {w.time.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "numeric",
                })}
              </Text>
              <Text style={{ color: "#3C5EA6" }}>
                {w.temperature_2m_min?.toFixed(1)}°C
              </Text>
              <Text style={{ color: "#A3273D" }}>
                {w.temperature_2m_max?.toFixed(1)}°C
              </Text>
              <Icon
                source={getWeatherIcons(w.weather_code)}
                color="gray"
                size={20}
              />
            </View>
          );
        })}
    </ScrollView>
  );
};

export default DailyData;
