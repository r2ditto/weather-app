import { useState, useEffect } from "react";

import { weatherService } from "@/services/weatherService";
import { WeatherData, Location } from "@/types";

import { getCurrentPosition } from "@/utils";

export function useLocationWeather() {
  const [confirmedLocation, setConfirmedLocation] = useState<Location | null>(
    null
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchCityData = async (lat: number, lon: number) => {
    const cityData = await weatherService.fetchCityByCoords(lat, lon);
    if (!cityData?.[0]) {
      throw new Error("Could not determine city from coordinates");
    }
    return cityData[0].name;
  };

  useEffect(() => {
    async function initializeLocationWeather() {
      setIsLoading(true);
      setError(undefined);

      try {
        // Get user's position
        const position = await getCurrentPosition();
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        // Get city name
        const cityName = await fetchCityData(coords.lat, coords.lon);

        // Set location first
        const location = { ...coords, name: cityName };
        setConfirmedLocation(location);

        // Then fetch weather data
        const weatherData = await weatherService.fetchWeatherByCoords(
          coords.lat,
          coords.lon
        );
        setWeather(weatherData);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof GeolocationPositionError
            ? "Unable to access your location. Please search for a city manually."
            : (error as Error).message || "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    initializeLocationWeather();
  }, []);

  return {
    confirmedLocation,
    setConfirmedLocation,
    weather,
    isLoading,
    error,
  };
}
