import { useState, useEffect } from "react";

import { weatherService } from "@/services/weatherService";
import { WeatherData, Location } from "@/types";

export function useLocationWeather() {
  const [confirmedLocation, setConfirmedLocation] = useState<Location | null>(
    null
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Geolocation effect
  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      setError(undefined);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };

          try {
            const data = await weatherService.fetchCityByCoords(
              coords.lat,
              coords.lon
            );
            if (data && data[0]) {
              setConfirmedLocation({ ...coords, name: data[0].name });
            }
          } catch (error) {
            console.error("Error fetching city:", error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to access your location. Please search for a city manually."
          );
          setIsLoading(false);
        }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Please search for a city manually."
      );
    }
  }, []);

  // Weather fetch effect
  useEffect(() => {
    const fetchWeather = async () => {
      if (!confirmedLocation) return;

      setIsLoading(true);
      setError(undefined);
      try {
        const data = await weatherService.fetchWeatherByCoords(
          confirmedLocation.lat,
          confirmedLocation.lon
        );
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError("Unable to fetch weather data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [confirmedLocation]);

  return {
    confirmedLocation,
    setConfirmedLocation,
    weather,
    isLoading,
    error,
  };
}
