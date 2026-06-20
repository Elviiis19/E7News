import React, { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, CloudLightning, Thermometer, MapPin } from "lucide-react";

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  icon: React.ReactNode;
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Default to Monte Negro - RO (Lat: -10.29, Lon: -63.30)
        let lat = -10.29;
        let lon = -63.30;
        let city = "Monte Negro";
        let state = "RO";

        // Try IP geolocation for silent, iframe-safe coordinates
        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          const geoData = await geoRes.json();
          if (geoData && geoData.latitude && geoData.longitude) {
            lat = geoData.latitude;
            lon = geoData.longitude;
            city = geoData.city || "Sua Região";
            state = geoData.region_code || geoData.region || "";
          }
        } catch (e) {
          console.error("IP Geolocation failed, using default Monte Negro - RO", e);
        }

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const result = await res.json();
        
        let icon = <Sun className="w-5 h-5 text-amber-500" />;
        const code = result.current_weather.weathercode;
        const temp = result.current_weather.temperature;
        
        // Basic mapping for WMO weather codes
        if (code >= 1 && code <= 3) icon = <Cloud className="w-5 h-5 text-slate-400" />;
        else if (code >= 51 && code <= 67) icon = <CloudRain className="w-5 h-5 text-blue-500" />;
        else if (code >= 95) icon = <CloudLightning className="w-5 h-5 text-purple-600" />;

        setData({
          temp: Math.round(temp),
          description: code === 0 ? "Ensolarado" : (code <= 3 ? "Nublado" : "Chuvoso"),
          city: `${city}${state ? ` - ${state.substring(0, 2).toUpperCase()}` : ''}`,
          icon
        });
      } catch (e) {
        console.error("Error fetching weather:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
     return <div className="animate-pulse bg-slate-100 dark:bg-zinc-800 rounded-lg h-10 w-48"></div>;
  }

  if (!data) return null;

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-2 shadow-sm font-sans text-sm hover:border-[#cc0000]/50 transition-colors cursor-default">
      <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400 font-medium">
        <MapPin className="w-4 h-4 text-[#cc0000] dark:text-red-500" />
        <span className="truncate max-w-[120px]" title={data.city}>{data.city}</span>
      </div>
      <div className="w-px h-4 bg-slate-200 dark:bg-zinc-700"></div>
      <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100 font-bold">
        {data.icon}
        <span>{data.temp}°C</span>
      </div>
    </div>
  );
}
