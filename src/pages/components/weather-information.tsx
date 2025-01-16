import Image from "next/image";

import InfoMessage from "./info-message";

import { WeatherData, Location } from "@/types";
import { getCurrentDate, getWeatherImage } from "@/utils";

import { WiHot } from "react-icons/wi";
import { FaTemperatureHigh, FaWind } from "react-icons/fa";

interface WeatherInfoProps {
  weather: WeatherData | null;
  isLoading: boolean;
  location: Location | null;
  error?: string;
}

export default function WeatherInfo({
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
  const weatherStats = [
    {
      Icon: WiHot,
      value: `${weather.main.humidity}%`,
      label: "Humidity",
      iconClass: "text-4xl",
    },
    {
      Icon: FaTemperatureHigh,
      value: `${Math.round(weather.main.feels_like)}°C`,
      label: "Feels like",
      iconClass: "text-2xl",
    },
    {
      Icon: FaWind,
      value: `${Math.round(weather.wind.speed)}km/h`,
      label: "Wind",
      iconClass: "text-2xl",
    },
  ];

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
        {weatherStats.map(({ Icon, value, label, iconClass }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="h-8 flex items-center">
              <Icon className={`text-zinc ${iconClass}`} />
            </div>
            <p className="text-zinc text-lg font-bold">{value}</p>
            <p className="text-zinc text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
