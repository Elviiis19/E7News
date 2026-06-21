import React, { useState, useEffect } from "react";
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Moon, CloudMoon, MapPin } from "lucide-react";

interface WeatherData {
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
  city: string;
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Default to Ouro Preto do Oeste - RO
        let lat = -10.7487;
        let lon = -62.2158;
        let city = "Ouro Preto do Oeste";

        // Optional IP geolocation fallback if user allows, but preserving the image style with Ouro Preto do Oeste as default
        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          const geoData = await geoRes.json();
          if (geoData && geoData.latitude && geoData.longitude && geoData.city) {
            lat = geoData.latitude;
            lon = geoData.longitude;
            city = geoData.city;
          }
        } catch (e) {
          console.error("IP Geolocation failed, using Ouro Preto do Oeste", e);
        }

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=1`);
        const result = await res.json();
        
        setData({
          ...result,
          city
        });
      } catch (e) {
        console.error("Error fetching weather:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number, isDay: boolean = true) => {
    if (code === 0) return isDay ? <Sun className="w-10 h-10 text-yellow-500" strokeWidth={1.5} /> : <Moon className="w-10 h-10 text-slate-400" strokeWidth={1.5} />;
    if (code === 1 || code === 2) return isDay ? <CloudSun className="w-10 h-10 text-yellow-500" strokeWidth={1.5} /> : <CloudMoon className="w-10 h-10 text-slate-400" strokeWidth={1.5} />;
    if (code === 3) return <Cloud className="w-10 h-10 text-slate-400" strokeWidth={1.5} />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-10 h-10 text-slate-400" strokeWidth={1.5} />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-10 h-10 text-blue-400" strokeWidth={1.5} />;
    if (code >= 95) return <CloudLightning className="w-10 h-10 text-slate-400" strokeWidth={1.5} />;
    return <CloudSun className="w-10 h-10 text-yellow-500" strokeWidth={1.5} />;
  };

  if (loading) {
     return <div className="animate-pulse bg-slate-100 dark:bg-zinc-800 rounded-lg min-h-[200px] w-full"></div>;
  }

  if (!data) return null;

  const maxTemp = Math.round(data.daily.temperature_2m_max[0]);
  const minTemp = Math.round(data.daily.temperature_2m_min[0]);
  const rainProb = data.daily.precipitation_probability_max[0];
  const rainSum = data.daily.precipitation_sum[0];

  const morningIdx = data.hourly.time.findIndex(t => t.endsWith("09:00"));
  const afternoonIdx = data.hourly.time.findIndex(t => t.endsWith("15:00"));
  const nightIdx = data.hourly.time.findIndex(t => t.endsWith("21:00"));

  const morningCode = morningIdx !== -1 ? data.hourly.weathercode[morningIdx] : 0;
  const afternoonCode = afternoonIdx !== -1 ? data.hourly.weathercode[afternoonIdx] : 0;
  const nightCode = nightIdx !== -1 ? data.hourly.weathercode[nightIdx] : 0;

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden font-sans shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
        <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-lg">Previsão do Tempo</h3>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 font-medium tracking-wide">Oferecido por:</span>
          <span className="text-xs font-black text-slate-400 dark:text-zinc-500">Open-Meteo</span>
        </div>
      </div>
      
      <div className="p-5">
        <h4 className="text-[19px] font-bold text-slate-800 dark:text-zinc-100 mb-1">{data.city}</h4>
        <p className="text-[15px] text-slate-500 dark:text-zinc-400 mb-6 font-medium">Probabilidade de chuva: {rainProb}% {rainSum}mm</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-2">
              {getWeatherIcon(morningCode, true)}
              <span className="text-sm text-slate-400 font-medium">manhã</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              {getWeatherIcon(afternoonCode, true)}
              <span className="text-sm text-slate-400 font-medium">tarde</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              {getWeatherIcon(nightCode, false)}
              <span className="text-sm text-slate-400 font-medium">noite</span>
            </div>
          </div>
          
          <div className="flex flex-col items-start gap-1 ml-4 pl-4 border-l border-slate-100 dark:border-zinc-800 lg:pl-6 lg:ml-6 min-w-[70px]">
             <div className="flex items-baseline gap-1 text-[#cc0000] dark:text-red-500">
               <span className="text-[22px] font-medium leading-none">{maxTemp}°</span>
               <span className="text-xs font-medium">max</span>
             </div>
             <div className="flex items-baseline gap-1 text-slate-400 dark:text-zinc-500 mt-2">
               <span className="text-[22px] font-medium leading-none">{minTemp}°</span>
               <span className="text-xs font-medium">min</span>
             </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] text-slate-400 font-medium">
          Informações meteorológicas fornecidas por Open-Meteo
        </div>
      </div>
    </div>
  );
}
