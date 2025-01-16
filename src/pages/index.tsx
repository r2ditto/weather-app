import React, { useState, useCallback, useEffect } from "react";

import Combobox from "./components/combo-box";
import WeatherInfo from "./components/weather-information";

import { useDebounce } from "../hooks/useDebounce";
import { useLocationWeather } from "../hooks/useLocationWeather";
import { weatherService } from "../services/weatherService";

import { CitySuggestion } from "@/types";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const { confirmedLocation, setConfirmedLocation, weather, isLoading, error } =
    useLocationWeather();
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);

  useEffect(() => {
    if (confirmedLocation?.name) {
      setSearchInput(confirmedLocation.name);
    }
  }, [confirmedLocation]);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await weatherService.fetchCitySuggestions(value);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedFetchSuggestions(value);
  };

  const handleSelectCity = (suggestion: CitySuggestion) => {
    setConfirmedLocation({
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: suggestion.name,
    });
    setSearchInput(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      {/* Combobox for city search */}
      <div className="m-10 max-w-2xl mx-auto p-5">
        <Combobox
          searchInput={searchInput}
          suggestions={suggestions}
          onInputChange={handleInputChange}
          onSelectSuggestion={handleSelectCity}
          placeholder="Search for a city"
        >
          <Combobox.Icon />
          <Combobox.Input />
          <Combobox.Suggestions
            renderOption={(option: { option: CitySuggestion }) => (
              <span>
                {option.option.name}
                <span className="text-gray-500 ml-1">
                  {option.option.country && `(${option.option.country})`}
                </span>
              </span>
            )}
          />
        </Combobox>
      </div>

      {/* Weather Information */}
      <WeatherInfo
        weather={weather}
        isLoading={isLoading}
        location={confirmedLocation}
        error={error}
      />
    </div>
  );
}
