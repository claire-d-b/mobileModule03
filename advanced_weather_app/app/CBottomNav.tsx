import * as React from "react";
import { BottomNavigation, Text, Icon } from "react-native-paper";
import {
  View,
  Dimensions,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import HourlyData from "./Hourly";
import DailyData from "./Daily";
import CurrentData from "./Current";
import CChip from "./CChip";
import { WeatherData } from "../hooks/useLocation";
import PagerView from "react-native-pager-view";

export const truncate = (str: string, maxLength: number = 10) =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

interface CurrentRouteProps {
  location: string;
  data: WeatherData | null;
  isLandscape: boolean;
}

interface TodayRouteProps {
  location: string;
  todayHourly: {
    time: Date;
    temperature_2m: number | undefined;
    weather_code: number | undefined;
    wind_speed_10m: number | undefined;
  }[];
  chartConfig: {};
  isLandscape: boolean;
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
  isLandscape: boolean;
}

const CurrRoute = ({ location, data, isLandscape }: CurrentRouteProps) => (
  <ScrollView
    style={{ width: "100%", backgroundColor: "transparent" }}
    contentContainerStyle={{
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      paddingTop: 20,
      paddingBottom: 20,
    }}
  >
    <CChip
      mode="outlined"
      onPress={() => {}}
      label="Weekly"
      textStyle={{}}
      style={{
        borderColor: "#534DB3", // ← directement dans style
        borderWidth: 1,
      }}
      icon=""
      disabled={true}
    >
      <Text style={{ color: "#534DB3" }}>Currently</Text>
    </CChip>
    {isLandscape && (
      <Text style={{ color: "#534DB3", fontFamily: "Inter-Light" }}>
        Scroll down to display weather information.
      </Text>
    )}
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 40,
        paddingBottom: 20,
      }}
    >
      <Icon source="map-marker-outline" color="#534DB3" size={25} />
      <Text style={{ color: "#534DB3", paddingLeft: 15 }}>{location}</Text>
    </View>
    <CurrentData location={location} data={data} />
  </ScrollView>
);

const TodayRoute = ({
  location,
  todayHourly,
  chartConfig,
  isLandscape,
}: TodayRouteProps) => (
  <ScrollView
    style={{ width: "100%", backgroundColor: "transparent" }}
    contentContainerStyle={{
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      paddingTop: 20,
      paddingBottom: 20,
    }}
  >
    <CChip
      mode="outlined"
      onPress={() => {}}
      label="Weekly"
      textStyle={{}}
      style={{
        borderColor: "#534DB3", // ← directement dans style
        borderWidth: 1,
      }}
      icon=""
      disabled={true}
    >
      <Text style={{ color: "#534DB3" }}>Today</Text>
    </CChip>
    {isLandscape && (
      <Text style={{ color: "#534DB3", fontFamily: "Inter-Light" }}>
        Scroll down to display weather information.
      </Text>
    )}
    <View
      style={{
        display: "flex",
        width: "100%",
        overflow: "scroll",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 40,
          paddingBottom: 20,
        }}
      >
        <Icon source="map-marker-outline" color="#534DB3" size={25} />
        <Text style={{ color: "#534DB3", paddingLeft: 15 }}>{location}</Text>
      </View>
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
          width={Dimensions.get("window").width}
          height={220}
          withDots={false}
          hidePointsAtIndex={[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]}
          yAxisSuffix="°C"
          withShadow
          // style={{
          //   display: "flex",
          //   padding: 20,
          //   borderRadius: 16,
          // }}
        />
      </View>
      <HourlyData hourly={todayHourly} />
    </View>
  </ScrollView>
);

const WeeklyRoute = ({
  location,
  weekly,
  chartConfig,
  isLandscape,
}: WeeklyRouteProps) => (
  <ScrollView
    style={{ width: "100%", backgroundColor: "transparent" }}
    contentContainerStyle={{
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      paddingTop: 20,
      paddingBottom: 20,
    }}
  >
    <CChip
      mode="outlined"
      onPress={() => {}}
      label="Weekly"
      textStyle={{}}
      style={{
        borderColor: "#534DB3", // ← directement dans style
        borderWidth: 1,
      }}
      icon=""
      disabled={true}
    >
      <Text style={{ color: "#534DB3" }}>Weekly</Text>
    </CChip>
    {isLandscape && (
      <Text style={{ color: "#534DB3", fontFamily: "Inter-Light" }}>
        Scroll down to display weather information.
      </Text>
    )}
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 40,
          paddingBottom: 20,
        }}
      >
        <Icon source="map-marker-outline" color="#534DB3" size={25} />
        <Text style={{ color: "#534DB3", paddingLeft: 15 }}>{location}</Text>
      </View>
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
          width={Dimensions.get("window").width}
          height={220}
          withDots={false}
          yAxisSuffix="°C"
          withShadow
          // style={{
          //   display: "flex",
          //   padding: 20,
          //   borderRadius: 16,
          // }}
        />
      </View>
    </View>
    <DailyData weekly={weekly} />
  </ScrollView>
);

interface Props {
  message: string;
  location: string;
  weatherData: WeatherData | null;
  index: number;
  onIndexChange: (i: number) => void;
  style?: {};
}

const _ = ({
  message,
  location,
  weatherData,
  index,
  onIndexChange,
  style,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const pagerRef = React.useRef<PagerView>(null);

  const today = new Date();
  // const [index, setIndex] = React.useState(0);
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

  const jumpTo = (key: string) => {
    const newIndex = routes.findIndex((r) => r.key === key);
    if (newIndex !== -1) {
      pagerRef.current?.setPageWithoutAnimation(newIndex);
      onIndexChange(newIndex);
    }
  };

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
    weatherData?.hourly?.time
      ?.map((time, i) => ({
        time,
        temperature_2m: weatherData.hourly.temperature_2m?.[i],
        weather_code: weatherData.hourly.weather_code?.[i],
        wind_speed_10m: weatherData.hourly.wind_speed_10m?.[i],
      }))
      .filter(({ time }) => {
        return (
          time.getFullYear() === today.getFullYear() &&
          time.getMonth() === today.getMonth() &&
          time.getDate() === today.getDate()
        );
      })
      .sort((a, b) => a.time.getTime() - b.time.getTime()) ?? [];

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
        <CurrRoute
          location={location}
          data={weatherData}
          isLandscape={isLandscape}
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
          isLandscape={isLandscape}
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
          isLandscape={isLandscape}
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
          }}
        >
          <Text>{message}</Text>
        </View>
      ),
  });

  React.useEffect(() => {
    // submittingRef.current contient la valeur (ici false au départ).
    // On peut la lire ou la modifier à tout moment (submittingRef.current = true) — ça ne redéclenche jamais un re-render du composant, contrairement à setState.
    pagerRef.current?.setPageWithoutAnimation(index);
  }, [index]);

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={index}
        onPageSelected={(e) => onIndexChange(e.nativeEvent.position)}
      >
        {routes.map((route) => (
          <View key={route.key} style={{ flex: 1 }}>
            {renderScene({ route, jumpTo })}
          </View>
        ))}
      </PagerView>
      <BottomNavigation.Bar
        navigationState={{ index, routes }}
        onTabPress={({ route }) => {
          const newIndex = routes.findIndex((r) => r.key === route.key);
          pagerRef.current?.setPageWithoutAnimation(newIndex);
          onIndexChange(newIndex);
        }}
        activeColor="white"
        inactiveColor="white"
        activeIndicatorStyle={{ backgroundColor: "#534DB3" }}
        style={{ backgroundColor: "#534DB3" }}
      />
    </View>
  );
};

export default _;
