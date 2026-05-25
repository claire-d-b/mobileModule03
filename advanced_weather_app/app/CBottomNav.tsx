import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import { View, Dimensions } from "react-native";
import getWeatherCode from "./weatherCodes";
import { LineChart } from "react-native-chart-kit";
import HourlyData from "./Hourly";
import DailyData from "./Daily";
import CurrentData from "./Current";

export const truncate = (str: string, maxLength: number = 10) =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

// types.ts
export interface WeatherData {
  current: {
    time: Date;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: Date[];
    temperature_2m: Float32Array | null;
    weather_code: Float32Array | null;
    wind_speed_10m: Float32Array | null;
  };
  daily: {
    time: Date[];
    temperature_2m_max: Float32Array | null;
    temperature_2m_min: Float32Array | null;
    weather_code: Float32Array | null;
    wind_speed_10m_max: Float32Array | null;
  };
}

interface RouteProps {
  location: string;
  data: WeatherData | null;
}

const CurrRoute = ({ location, data }: RouteProps) => (
  <View
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      backgroundColor: "transparent",
    }}
  >
    <Text>Currently</Text>
    <CurrentData location={location} data={data} />
  </View>
);

interface TodayRouteProps {
  location: string;
  todayHourly: {
    time: Date;
    temperature_2m: number | undefined;
    weather_code: number | undefined;
    wind_speed_10m: number | undefined;
  }[];
  chartConfig: {};
}

interface WeeklyRouteProps {
  location: string;
  weekly: {
    time: Date;
    temperature_2m_max: number | undefined;
    temperature_2m_min: number | undefined;
    weather_code: number | undefined;
    wind_speed_10m_max: number | undefined;
  }[];
  chartConfig: {};
}

const TodayRoute = ({
  location,
  todayHourly,
  chartConfig,
}: TodayRouteProps) => (
  <View
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      backgroundColor: "transparent",
    }}
  >
    <Text>Today</Text>
    <View
      style={{
        display: "flex",
        padding: 20,
        width: "100%",
        height: "100%",
        overflow: "scroll",
        backgroundColor: "transparent",
      }}
    >
      <Text>{location}</Text>
      <View
        style={{
          display: "flex",
          width: "100%",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <LineChart
          data={{
            labels: todayHourly.map((h) => `${h.time.getHours().toString()}h`),
            datasets: [
              {
                data: todayHourly.map((h) => h.temperature_2m ?? 0),
                color: (opacity = 1) => `rgba(83, 77, 179, ${opacity + 0.5})`,
                strokeWidth: 2,
              },
            ],
          }}
          chartConfig={chartConfig}
          width={Dimensions.get("window").width - 20}
          height={220}
          withDots={false}
          hidePointsAtIndex={[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]}
          yAxisSuffix="°C"
          withShadow
          style={{
            display: "flex",
            padding: 20,
            borderRadius: 16,
          }}
        />
      </View>
      <HourlyData hourly={todayHourly} />
    </View>
  </View>
);

const WeeklyRoute = ({ location, weekly, chartConfig }: WeeklyRouteProps) => (
  <View
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      backgroundColor: "transparent",
    }}
  >
    <Text>Weekly</Text>
    <View
      style={{
        display: "flex",
        padding: 20,
        width: "100%",
        height: "100%",
        overflow: "scroll",
        backgroundColor: "transparent",
      }}
    >
      <Text>{location}</Text>
      <View
        style={{
          display: "flex",
          width: "100%",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <LineChart
          data={{
            labels: weekly.map((w) =>
              w.time.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "numeric",
              }),
            ),
            datasets: [
              {
                data: weekly.map((w) => w.temperature_2m_min ?? 0),
                color: (opacity = 1) => `rgba(163, 39, 61, ${opacity + 0.5})`,
                strokeWidth: 2,
              },
              {
                data: weekly.map((w) => w.temperature_2m_max ?? 0),
                color: (opacity = 1) => `rgba(60, 94, 166, ${opacity + 0.5})`,
                strokeWidth: 2,
              },
            ],
          }}
          chartConfig={chartConfig}
          width={Dimensions.get("window").width - 20}
          height={220}
          withDots={false}
          yAxisSuffix="°C"
          withShadow
          style={{
            display: "flex",
            padding: 20,
            borderRadius: 16,
          }}
        />
      </View>
      <DailyData weekly={weekly} />
    </View>
  </View>
);

interface Props {
  message: string;
  location: string;
  weatherData: WeatherData | null;
  style: {};
}

const CBottomNav = ({ message, location, weatherData, style }: Props) => {
  const today = new Date();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "currently",
      title: "Currently",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
    {
      key: "today",
      title: "Today",
      focusedIcon: "calendar-today",
      unfocusedIcon: "calendar-today-outline",
    },
    {
      key: "weekly",
      title: "Weekly",
      focusedIcon: "calendar-week",
      unfocusedIcon: "calendar-week-outline",
    },
  ]);
  const chartConfig = {
    backgroundGradientFrom: "#B6C1D4",
    backgroundGradientFromOpacity: 0.25,
    backgroundGradientTo: "#B6C1D4",
    backgroundGradientToOpacity: 0.25,
    color: (opacity = 1) => `rgba(60, 76, 103, ${opacity + 0.5})`,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false, // optional
    decimalPlaces: 1,
  };

  const todayHourly =
    weatherData?.hourly.time
      .map((time, i) => ({
        time,
        temperature_2m: weatherData.hourly.temperature_2m?.[i],
        weather_code: weatherData.hourly.weather_code?.[i],
        wind_speed_10m: weatherData.hourly.wind_speed_10m?.[i],
      }))
      .filter(({ time }) => {
        const timeUTC = Date.UTC(
          time.getUTCFullYear(),
          time.getUTCMonth(),
          time.getUTCDate(),
        );
        const todayUTC = Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
        );
        return timeUTC === todayUTC;
      }) ?? [];
  const weekly =
    weatherData?.daily.time.map((time, i) => ({
      time,
      temperature_2m_max: weatherData.daily.temperature_2m_max?.[i],
      temperature_2m_min: weatherData.daily.temperature_2m_min?.[i],
      weather_code: weatherData.daily.weather_code?.[i],
      wind_speed_10m_max: weatherData.daily.wind_speed_10m_max?.[i],
    })) ?? [];

  const renderScene = BottomNavigation.SceneMap({
    currently: () =>
      message === "" ? (
        <CurrRoute location={location} data={weatherData} />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text>{message}</Text>
        </View>
      ),
    today: () =>
      message === "" ? (
        <TodayRoute
          location={location}
          todayHourly={todayHourly}
          chartConfig={chartConfig}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text>{message}</Text>
        </View>
      ),
    weekly: () =>
      message === "" ? (
        <WeeklyRoute
          location={location}
          weekly={weekly}
          chartConfig={chartConfig}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text>{message}</Text>
        </View>
      ),
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="white"
      inactiveColor="white"
      activeIndicatorStyle={{ backgroundColor: "#534DB3" }}
      barStyle={{ backgroundColor: "#534DB3" }}
      style={style}
      theme={{
        colors: {
          secondaryContainer: "transparent",
          background: "transparent",
          surface: "transparent",
        },
      }}
    />
  );
};

export default CBottomNav;
