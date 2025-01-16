import React from "react";
import { Combobox } from "./components/combo-box";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-5">
      {/* Combobox for city search */}
      <div className="m-10 max-w-2xl mx-auto p-5">
        <Combobox>
          <Combobox.Icon />
          <Combobox.Input />
        </Combobox>
      </div>

      {/* Weather information */}
      <div className="flex items-center justify-center flex-col">
        <Image
          src="/cloudy.png"
          alt="Cloudy weather icon"
          width={300}
          height={300}
          className="opacity-80 animate-float"
          priority
        />

        <div className="text-center">
          <p className="text-white text-8xl font-bold my-5">24°C</p>
          <p className="text-white text-xl">Sunny</p>
          <p className="text-white text-md">Wednesday, 16th January</p>
        </div>

        <div className="text-center rounded-lg bg-white p-10 mt-10 w-full flex justify-between">
          <div className="flex flex-col">
            <p className="text-zinc text-lg font-bold">25%</p>
            <p className="text-zinc text-xs">Humidity</p>
          </div>
          <div className="flex flex-col">
            <p className="text-zinc text-lg font-bold">50%</p>
            <p className="text-zinc text-xs">Chance of rain</p>
          </div>
          <div className="flex flex-col">
            <p className="text-zinc text-lg font-bold">9km/h</p>
            <p className="text-zinc text-xs">Wind</p>
          </div>
        </div>
      </div>
    </div>
  );
}
