const makeWeatherRequest = async (
  endpoint: string,
  params: Record<string, string | number>
) => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    const response = await fetch(
      `/api/weather?endpoint=${endpoint}&${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const weatherService = {
  async fetchCityByCoords(lat: number, lng: number) {
    return makeWeatherRequest("reverse-geocoding", { lat, lon: lng, limit: 1 });
  },

  async fetchWeatherByCoords(lat: number, lng: number) {
    return makeWeatherRequest("weather", { lat, lon: lng, units: "metric" });
  },

  async fetchCitySuggestions(query: string) {
    return makeWeatherRequest("direct-geocoding", { q: query, limit: 5 });
  },
};
