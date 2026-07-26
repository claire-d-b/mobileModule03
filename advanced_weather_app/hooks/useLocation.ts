import * as Location from "expo-location"; // donne accès au GPS, aux permissions, et au géocodage.
import * as IntentLauncher from "expo-intent-launcher"; // Permet d'ouvrir des écrans natifs spécifiques
// d'Android (ici, les paramètres de localisation) depuis le JS.
// Deux hooks React : useState pour l'état local, useEffect pour exécuter du code en réaction à des
// changements ou au montage du composant.
import { useState, useEffect } from "react";
// Platform détecte si on est sur iOS ou Android. Alert affiche une popup native.
import { Platform, Alert } from "react-native";
// Fonction custom qui appelle l'API Open-Meteo et retourne les données météo formatées.
import { getForecasts } from "../functions/forecasts";
// Permet de vérifier l'état de la connexion réseau (wifi/4G/hors-ligne).
import NetInfo from "@react-native-community/netinfo";

interface Coords {
  latitude: number | undefined;
  longitude: number | undefined;
}

// Décrit la forme complète de la réponse météo : conditions actuelles, prévisions horaires,
// prévisions journalières — chaque valeur individuelle est null | undefined car l'API
// peut ne pas toujours renvoyer une donnée.
export interface WeatherData {
  current: {
    time: Date | null | undefined;
    temperature_2m: number | null | undefined;
    weather_code: number | null | undefined;
    wind_speed_10m: number | null | undefined;
  };
  hourly: {
    time: Date[] | null | undefined;
    temperature_2m: Float32Array | null | undefined;
    weather_code: Float32Array | null | undefined;
    wind_speed_10m: Float32Array | null | undefined;
  };
  daily: {
    time: Date[];
    temperature_2m_max: Float32Array | null | undefined;
    temperature_2m_min: Float32Array | null | undefined;
    weather_code: Float32Array | null | undefined;
    wind_speed_10m_max: Float32Array | null | undefined;
  };
}

// expo-location est la librairie qui donne accès au GPS.
// Elle fait le pont entre JavaScript et les APIs natives du téléphone :
// Sans elle, tu ne peux pas accéder au GPS depuis React Native.
// C'est elle qui gère aussi les permissions (requestForegroundPermissionsAsync).

// Actually requests permission — this is the only function that should trigger
// the native OS dialog.
const requestPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

// Vérifie l'état actuel de la permission sans afficher de popup —
// utilisée partout ailleurs pour éviter de redemander sans cesse.
const hasPermission = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};

// Vérifie si le GPS/service de localisation est activé sur l'appareil
// (différent de la permission — l'utilisateur peut avoir autorisé l'app, mais avoir le GPS coupé).
const checkGPSEnabled = async (): Promise<boolean> => {
  return await Location.hasServicesEnabledAsync();
};

// Affiche une alerte demandant d'activer le GPS, avec deux boutons : "Open Settings"
// (ouvre l'écran système correspondant — différent selon Android/iOS) et "Cancel" (ferme juste la popup).
const promptEnableGPS = (): void => {
  Alert.alert(
    "GPS Settings",
    "Please enable location services to detect your position.",
    [
      {
        text: "Open Settings",
        onPress: () => {
          if (Platform.OS === "android") {
            IntentLauncher.startActivityAsync(
              IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS,
            );
          } else {
            Location.enableNetworkProviderAsync();
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ],
  );
};

// Récupère la position GPS actuelle une seule fois (un "instantané") :

// Vérifie la permission (sans la redemander)
// Vérifie que le GPS est activé, sinon affiche la popup et abandonne
// Récupère la position avec haute précision
// Retourne uniquement latitude/longitude
const getLocation = async (): Promise<Coords | null> => {
  const granted = await hasPermission();
  if (!granted) return null;

  const gpsOn = await checkGPSEnabled();
  if (!gpsOn) {
    promptEnableGPS();
    return null;
  }

  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
};

// Contrairement à getLocation (un seul instantané), cette fonction écoute en continu
// les changements de position :

// Vérifie d'abord la permission
// watchPositionAsync déclenche le callback onChange à chaque fois que l'utilisateur bouge
// d'au moins 10 mètres, avec un minimum de 5 secondes entre deux mises à jour
// Retourne un objet subscriber qui permettra plus tard d'arrêter cette écoute (.remove())
export const trackLocation = async (
  onChange: (coords: Coords) => void,
): Promise<Location.LocationSubscription | null> => {
  const granted = await hasPermission();
  if (!granted) return null;

  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // 5s between each update
      distanceInterval: 10, // updates when the location has changed by at least this distance in meters
    },
    ({ coords }) =>
      onChange({ latitude: coords.latitude, longitude: coords.longitude }),
  );
};

// Transforme des coordonnées GPS en une adresse lisible (ex: "12, Rue de la Paix, Paris, Île-de-France, France") :

// Vérifie que les coordonnées existent
// reverseGeocodeAsync retourne un tableau de résultats possibles — on prend le premier ([place])
// Si rien trouvé, retourne null
// Sinon, assemble les champs disponibles (numéro, rue, ville, région, pays), en filtrant ceux qui
// seraient absents (filter(Boolean)), puis les joint avec des virgules
// Le try/catch (qu'on a ajouté ensemble) évite un crash si l'appel échoue (timeout réseau, etc.)
export const getLocationName = async (
  coords: Coords,
): Promise<string | null> => {
  if (coords.latitude === undefined || coords.longitude === undefined)
    return null;
  // Reverse geocode a location to postal address.
  // On Android, you must request location permissions with requestForegroundPermissionsAsync
  // before geocoding can be used.
  try {
    const [place] = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    if (!place) return null;
    return (
      [
        place.streetNumber,
        place.street,
        place.city,
        place.region,
        place.country,
      ]
        .filter(Boolean) // .filter(Boolean) supprime les valeurs falsy du tableau avant de les joindre.
        // Valeurs falsy = undefined, null, "", 0, false, NaN.
        .join(", ")
    );
  } catch (e) {
    console.warn("Reverse geocoding failed:", e);
    return null;
  }
};

// Utilisée quand l'utilisateur tape un nom de lieu dans une barre de recherche :
// Si la chaîne est vide, retourne un tableau vide immédiatement
// Sinon, interroge l'API de géocodage d'Open-Meteo pour trouver jusqu'à 10 lieux correspondants
// Retourne les résultats, ou un tableau vide si la requête échoue
export const getPlacesList = async (location: string) => {
  if (!location) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results ?? [];
  } catch {
    console.error("Places fetch failed.");
    return [];
  }
};

// Le hook accepte optionnellement des coordonnées externes — utile quand l'utilisateur a
// choisi manuellement un lieu via la recherche (au lieu d'utiliser le GPS).
// Détermine quelles coordonnées utiliser réellement : celles fournies de l'extérieur
// en priorité, sinon celles détectées par GPS en interne.
export const useLocation = (externalCoords?: {
  latitude: number;
  longitude: number;
}) => {
  const [address, setAddress] = useState<string>("");
  const [coords, setCoords] = useState<Coords>({
    latitude: undefined,
    longitude: undefined,
  });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const activeCoords = externalCoords ?? coords;

  // Fetch ensemble weather when coords change
  useEffect(() => {
    const fetchForecasts = async () => {
      if (
        // Si aucune coordonnée valide, ne fait rien
        activeCoords.latitude === undefined ||
        activeCoords.longitude === undefined
      )
        return;
      // Vérifie la connexion réseau avant de tenter l'appel
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setError("Internet connexion lost.");
        setWeatherData(null);
        return;
      }

      try {
        const response = await getForecasts({
          latitude: activeCoords.latitude,
          longitude: activeCoords.longitude,
          daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "wind_speed_10m_max",
          ],
          hourly: ["temperature_2m", "weather_code", "wind_speed_10m"],
          current: ["temperature_2m", "weather_code", "wind_speed_10m"],
          past_hours: 24, // to get 00:00am first instead of 02:00am
        });
        setWeatherData(response);
        setError("");
      } catch {
        setWeatherData(null);
        setError("Unable to fetch weather data.");
      }
    };
    // Se relance à chaque fois que activeCoords change (nouvelle position GPS, ou nouveau lieu choisi manuellement) :
    fetchForecasts();
  }, [activeCoords.latitude, activeCoords.longitude]);

  // Get location on mount and track changes
  // Ne s'exécute qu'une seule fois au montage ([] vide) :

  // Demande la permission GPS (popup natif)
  // Si refusée, arrête le chargement et affiche une erreur
  // Sinon, récupère la position actuelle une fois
  // Récupère et affiche l'adresse correspondante
  // Marque le chargement comme terminé
  // Démarre le suivi continu — mais avec une garde if (externalCoords) return; :
  // si l'utilisateur a choisi un lieu manuellement, on ignore les mises à jour GPS pour ne pas écraser son choix
  // Le return () => subscriber?.remove() nettoie l'abonnement GPS quand le composant est démonté,
  // pour éviter les fuites mémoire
  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    const init = async () => {
      // Single point where the native permission dialog can appear.
      const granted = await requestPermission();
      if (!granted) {
        setLoading(false);
        setError("Please allow GPS.");
        return;
      }

      const initialCoords = await getLocation();
      const currentCoords = {
        latitude: initialCoords?.latitude,
        longitude: initialCoords?.longitude,
      };
      setCoords(currentCoords);

      const name = await getLocationName(currentCoords);
      setAddress(name ?? "");
      setLoading(false);

      subscriber = await trackLocation(async (newCoords) => {
        if (externalCoords) return;
        setCoords(newCoords);
        const newAddress = await getLocationName(newCoords);
        setAddress(newAddress ?? "");
      });
    };

    init();
    // cleanup function of the useEffect — React calls it automatically when component is unmounted.
    return () => subscriber?.remove();
  }, []);

  //Écoute en continu les changements de connectivité réseau :

  // Si la connexion tombe, affiche l'erreur correspondante
  // Si elle revient, efface seulement ce message d'erreur précis (sans écraser une autre erreur
  // potentiellement affichée, comme "Please allow GPS.")
  // Se désabonne au démontage
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setError("Internet connexion lost.");
      } else {
        setError((prev) => (prev === "Internet connexion lost." ? "" : prev));
      }
    });

    return () => unsubscribe();
  }, []);

  return { address, coords: activeCoords, weatherData, loading, error };
};
