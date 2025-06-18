"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, Droplets, Wind, Gauge } from "lucide-react";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  name: string;
  dt: number;
}

export default function WeatherApp() {
  const [city, setCity] = useState("lucknow");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  const getCountryName = (code: string) => {
    try {
      return new Intl.DisplayNames([code], { type: "region" }).of(code);
    } catch {
      return code;
    }
  };

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (weatherData) {
      const curDate = new Date(weatherData.dt * 1000);
      const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      setFormattedDate(formatter.format(curDate));
    }
  }, [weatherData]);

  // const getDateTime = (dt: number) => {
  //   const curDate = new Date(dt * 1000)
  //   const options: Intl.DateTimeFormatOptions = {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //   }
  //   const formatter = new Intl.DateTimeFormat("en-US", options)
  //   return formatter.format(curDate)
  // }

  const getBackgroundImage = (weatherType: string) => {
    const backgrounds: Record<string, string> = {
      Clear:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80",
      Clouds:
        "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1920&q=80",
      Rain: "https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1920&q=80",
      Snow: "https://images.unsplash.com/photo-1608889175119-2826c8ec6d96?auto=format&fit=crop&w=1920&q=80",
      Thunderstorm:
        "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=1920&q=80",
      Drizzle:
        "https://images.unsplash.com/photo-1600267165070-b4ec60e66417?auto=format&fit=crop&w=1920&q=80",
      Mist: "https://images.unsplash.com/photo-1502082553000-7b30ee95d63c?auto=format&fit=crop&w=1920&q=80",
      Haze: "https://images.unsplash.com/photo-1552083974-186346191183?auto=format&fit=crop&w=1920&q=80",
      Fog: "https://images.unsplash.com/photo-1502082553000-7b30ee95d63c?auto=format&fit=crop&w=1920&q=80",
      Default:
        "https://images.unsplash.com/photo-1524492449090-9c3a91eae646?auto=format&fit=crop&w=1920&q=80",
    };
    return backgrounds[weatherType] || backgrounds["Default"];
  };

  const getWeatherData = async (cityName: string = city) => {
    setLoading(true);
    const url = `https://open-weather13.p.rapidapi.com/city/${cityName}/EN`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "30cb814c9amshf7be6197edb7441p1b31c9jsn2b2ec1bbff51",
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      setWeatherData(result);
      setBackgroundImage(getBackgroundImage(result.weather[0].main));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      getWeatherData(searchInput.trim());
      setSearchInput("");
    }
  };

  useEffect(() => {
    getWeatherData();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : `url('https://images.unsplash.com/photo-1524492449090-9c3a91eae646?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="bg-white text-gray-800 p-4 w-full max-w-md mx-auto rounded-lg shadow-lg text-lg">
        {/* Search Header */}
        <div className="flex justify-between items-center mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search your city..."
              className="bg-gray-100 text-gray-800 pl-10 pr-4 py-1.5 rounded-md outline-none placeholder-gray-500 shadow-sm border border-gray-200 focus:border-blue-400 focus:bg-white transition-colors"
            />
          </form>
        </div>

        {/* Weather Body */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4">Loading weather data...</p>
          </div>
        ) : weatherData ? (
          <div className="text-center">
            <h1 className="text-3xl font-black mb-1">
              {weatherData.name}, {getCountryName(weatherData.sys.country)}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{formattedDate}</p>

            <div className="mb-3">
              <div className="bg-gray-800 text-white inline-block px-4 py-2 rounded-full text-sm mb-2 font-semibold">
                {weatherData.weather[0].main}
              </div>
              <div>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt="Weather icon"
                  className="w-24 h-24 mx-auto drop-shadow-lg"
                />
              </div>
            </div>

            <p className="text-5xl font-black mb-2">
              {Math.round(weatherData.main.temp)}°
            </p>

            <div className="flex justify-center gap-4 mb-4">
              <p className="text-m font-semibold">
                Min: {Math.round(weatherData.main.temp_min)}°
              </p>
              <p className="text-m font-semibold">
                Max: {Math.round(weatherData.main.temp_max)}°
              </p>
            </div>

            {/* Weather Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 p-3 rounded-lg shadow-md flex items-center">
                <Droplets className="h-6 w-6 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Feels Like
                  </p>
                  <p className="font-bold">
                    {Math.round(weatherData.main.feels_like)}°
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg shadow-md flex items-center">
                <Droplets className="h-6 w-6 mr-3 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Humidity</p>
                  <p className="font-bold">{weatherData.main.humidity}%</p>
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg shadow-md flex items-center">
                <Wind className="h-6 w-6 mr-3 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Wind</p>
                  <p className="font-bold">{weatherData.wind.speed} m/s</p>
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg shadow-md flex items-center">
                <Gauge className="h-6 w-6 mr-3 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pressure</p>
                  <p className="font-bold">{weatherData.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No weather data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
