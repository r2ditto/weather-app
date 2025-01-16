import { useState, useEffect } from "react";

import { weatherService } from "@/services/weatherService";
import { WeatherData, Location } from "@/types";

import { getCurrentPosition } from "@/utils";

export function useLocationWeather() {
  const [confirmedLocation, setConfirmedLocation] = useState<Location | null>(
    null
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Handle initial geolocation
  useEffect(() => {
    let isActive = true;

    async function initializeLocation() {
      setIsLoadingLocation(true);
      setError(undefined);

      try {
        const position = await getCurrentPosition();
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        const cityData = await weatherService.fetchCityByCoords(
          coords.lat,
          coords.lon
        );
        if (!cityData?.[0]) {
          throw new Error("Could not determine city from coordinates");
        }

        if (isActive) {
          setConfirmedLocation({ ...coords, name: cityData[0].name });
        }
      } catch (error) {
        if (isActive) {
          console.error("Error:", error);
          setError(
            error instanceof GeolocationPositionError
              ? "Unable to access your location. Please search for a city manually."
              : (error as Error).message || "An unexpected error occurred"
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingLocation(false);
        }
      }
    }

    initializeLocation();
    return () => {
      isActive = false;
    };
  }, []);

  // Handle weather updates
  useEffect(() => {
    let isActive = true;
    const abortController = new AbortController();

    async function fetchWeather() {
      if (!confirmedLocation) return;

      setIsLoadingWeather(true);
      setError(undefined);

      try {
        const weatherData = await weatherService.fetchWeatherByCoords(
          confirmedLocation.lat,
          confirmedLocation.lon
        );

        if (isActive) {
          setWeather(weatherData);
        }
      } catch (error) {
        if (isActive) {
          console.error("Error fetching weather:", error);
          setError("Unable to fetch weather data. Please try again later.");
        }
      } finally {
        if (isActive) {
          setIsLoadingWeather(false);
        }
      }
    }

    fetchWeather();

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [confirmedLocation]);

  return {
    confirmedLocation,
    setConfirmedLocation,
    weather,
    isLoading: isLoadingLocation || isLoadingWeather,
    error,
  };
}
