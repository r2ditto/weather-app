export const getCurrentDate = () => {
  const date = new Date();

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const getWeatherImage = (weatherCondition: string | undefined) => {
  if (!weatherCondition) return "/clouds.png";

  const condition = weatherCondition.toLowerCase();

  switch (condition) {
    case "clear":
      return "/clear.png";
    case "rain":
    case "drizzle":
      return "/rain.png";
    case "thunderstorm":
      return "/thunder.png";
    case "snow":
      return "/snow.png";
    case "mist":
    case "fog":
    case "haze":
      return "/haze.png";
    default:
      return "/clouds.png";
  }
};

export const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  if (!("geolocation" in navigator)) {
    throw new Error(
      "Geolocation is not supported by your browser. Please search for a city manually."
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
