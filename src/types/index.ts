export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location extends Coordinates {
  name: string;
}

export interface CitySuggestion extends Location {
  country?: string;
}
