import type { NextApiRequest, NextApiResponse } from "next";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ message: "Endpoint parameter is required" });
  }

  let url: string;
  switch (endpoint) {
    case "reverse-geocoding":
      url = `${BASE_URL}/geo/1.0/reverse`;
      break;
    case "direct-geocoding":
      url = `${BASE_URL}/geo/1.0/direct`;
      break;
    case "weather":
      url = `${BASE_URL}/data/2.5/weather`;
      break;
    default:
      return res.status(400).json({ message: "Invalid endpoint" });
  }

  try {
    const queryParams = new URLSearchParams({
      ...params,
      appid: OPENWEATHER_API_KEY as string,
    });

    const response = await fetch(`${url}?${queryParams}`);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Weather API Error:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
}
