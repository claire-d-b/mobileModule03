import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import { getWeatherCode, getWeatherIcons } from "../functions/weatherCodes";
import { WeatherData } from "../hooks/useLocation";

export const truncate = (str: string, maxLength: number = 10) =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

interface CurrentProps {
  location: string;
  data: WeatherData | null;
}

const CurrentData = ({ location, data }: CurrentProps) => {
  return (
    location &&
    data && (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 10,
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <Icon
          source={getWeatherIcons(data?.current.weather_code)}
          color="#534DB3"
          size={40}
        />
        <Text
          style={{ color: "#534DB3", fontSize: 25, fontFamily: "Inter-Light" }}
        >
          {getWeatherCode(data?.current.weather_code)}
        </Text>
        <Text style={{ color: "#534DB3", fontSize: 16, fontWeight: "bold" }}>
          {data?.current?.temperature_2m?.toFixed(1)}°C
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
            {data?.current?.wind_speed_10m?.toFixed(1)}km/h
          </Text>
        </View>
      </View>
    )
  );
};

export default CurrentData;
