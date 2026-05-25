import * as Location from "expo-location";
import React, { useState, useEffect, use } from "react";
import {
  View,
  ActivityIndicator,
  BlurEvent,
  ImageBackground,
} from "react-native";
import { Appbar, Text, IconButton, Icon, Menu } from "react-native-paper";
import { evaluate } from "mathjs";
import CTextInput from "./CTextInput";
import CBottomNav from "./CBottomNav";
import { useLocation, getPlacesList, getLocationName } from "./useLocation";
import getForecasts from "./ensemble";

interface Place {
  name: string;
  admin1: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function CAppbar() {
  // const [weatherData, setWeatherData] = useState({})
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | undefined>(
    undefined,
  );
  const {
    address: detectedAddress,
    coords,
    weatherData,
    loading,
  } = useLocation();
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [placesList, setPlacesList] = useState<Place[]>([]);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      const list = await getPlacesList(address);
      // console.log("list", list);
      setPlacesList(list);
    };

    fetchPlaces();
    // console.log(placesList);
  }, [address]); // also changed to depend on location, not address

  return (
    <ImageBackground
      source={require("../assets/wallpaper.png")}
      style={{ width: "100%", height: "100%", flexDirection: "column" }}
      resizeMode="cover"
    >
      <Appbar.Header
        style={{
          padding: 0,
          margin: 5,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Icon source="magnify" color="#534DB3" size={20} />
          <CTextInput
            onBlur={(e: any) => {
              setLocation(address);
              setVisible(false);
              // setLocation("");
              setErrorMessage("Location not found.");
            }}
            onChangeText={(text: string) => {
              setAddress(text);
              setVisible(true);
              setErrorMessage("");
            }}
            textColor="#534DB3"
            label="Location"
            msg={address}
            placeholder="Search location..."
            variant="flat"
            outlineColor="white"
            activeOutlineColor="white"
            underlineColor="white"
            activeUnderlineColor="#534DB3"
            selectionColor="white"
            contentStyle={{}}
            style={{
              backgroundColor: "transparent",
              width: "75%",
              borderRadius: 15,
              borderColor: "white",
            }}
          />
        </View>
        <IconButton
          icon="navigation"
          iconColor="#534DB3"
          size={20}
          onPress={() => {
            setLocation(detectedAddress);
            setSelectedCoords(undefined);
            setErrorMessage("");
            setVisible(false);
          }}
          style={{ transform: "rotate(45deg);" }}
        />
      </Appbar.Header>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
          }}
        >
          {visible &&
            !!placesList.length &&
            placesList.map((p, i) => {
              if (i < 5)
                return (
                  <View key={`place_${i}`} style={{ display: "flex" }}>
                    <Menu.Item
                      title={
                        <>
                          <Text
                            style={{ fontWeight: "bold" }}
                          >{`${p.name}, `}</Text>
                          <Text>{`${p.admin1}, `}</Text>
                          <Text>{`${p.country}`}</Text>
                        </>
                      }
                      onPress={(_) => {
                        setLocation(`${p.name}, ${p.admin1}, ${p.country}`);
                        console.log("loc", p.name);
                        setSelectedCoords({
                          latitude: p.latitude,
                          longitude: p.longitude,
                        });
                        setErrorMessage("");
                        setVisible(false);
                      }}
                    ></Menu.Item>
                  </View>
                );
            })}
          {!visible && (
            <CBottomNav
              message={errorMessage}
              location={location}
              weatherData={weatherData}
              style={{
                height: "100%",
                paddingBottom: 40,
                backgroundColor: "transparent",
              }}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
