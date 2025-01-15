import React, { useState, useEffect } from "react";

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [cityName, setCityName] = useState<string>("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchCityName = async () => {
      if (!location) return;

      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.lng}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        if (data && data[0]) {
          setCityName(data[0].name);
        }
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };

    fetchCityName();
  }, [location]);

  return (
    <>
      <div className="px-10">
        <h1 className="text-9xl font-bold text-zinc-400">
          Todays <br />
          Weather
        </h1>
        <p className="ml-5 text-lg mt-2 text-zinc-700">
          search for a city and get the current weather report before you step
          out.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative text-gray-600 m-20 max-w-md mx-auto">
        <input
          type="search"
          name="search"
          placeholder="Search"
          value={cityName || "Loading location..."}
          className="bg-white py-3 px-5 pr-10 rounded-full text-xl focus:outline-none w-full"
        />

        <button type="submit" className="absolute right-0 top-0 mt-2 mr-3">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            xmlSpace="preserve"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </div>
    </>
  );
}
