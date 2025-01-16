import Image from "next/image";

import { InfoMessage } from "./info-message";

import { WeatherData, Location } from "@/types";
import { getCurrentDate, getWeatherImage } from "@/utils";

interface WeatherInfoProps {
  weather: WeatherData | null;
  isLoading: boolean;
  location: Location | null;
  error?: string;
}

export function WeatherInfo({
  weather,
  isLoading,
  location,
  error,
}: WeatherInfoProps) {
  if (error) {
    return <InfoMessage message={error} />;
  }

  if (isLoading) {
    return <InfoMessage message="Loading weather data..." />;
  }

  if (!weather || (!location && !isLoading)) {
    return (
      <InfoMessage
        message={
          !weather
            ? "No weather data available"
            : "Please allow location access or search for a city to see weather information"
        }
      />
    );
  }

  const weatherImage = getWeatherImage(weather?.weather[0]?.main);

  return (
    <div className="flex items-center justify-center flex-col">
      <Image
        src={weatherImage}
        alt={`${weather?.weather[0]?.main || "Cloudy"} weather icon`}
        width={300}
        height={300}
        className="opacity-80 animate-float"
        priority
      />

      <div className="text-center">
        <p className="text-white text-8xl font-bold my-5">
          {`${Math.round(weather.main.temp)}°C`}
        </p>
        <p className="text-white text-xl">{weather.weather[0].main}</p>
        <p className="text-white text-md">{getCurrentDate()}</p>
      </div>

      <div className="text-center rounded-lg bg-white p-10 mt-10 w-full flex justify-between">
        <div className="flex flex-col">
          <p className="text-zinc text-lg font-bold">
            {`${weather.main.humidity}%`}
          </p>
          <p className="text-zinc text-xs">Humidity</p>
        </div>
        <div className="flex flex-col">
          <p className="text-zinc text-lg font-bold">
            {`${Math.round(weather.main.feels_like)}°C`}
          </p>
          <p className="text-zinc text-xs">Feels like</p>
        </div>
        <div className="flex flex-col">
          <p className="text-zinc text-lg font-bold">
            {`${Math.round(weather.wind.speed)}km/h`}
          </p>
          <p className="text-zinc text-xs">Wind</p>
        </div>
      </div>
    </div>
  );
}
