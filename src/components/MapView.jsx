import { MapContainer, TileLayer, Marker, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Store, TreePine, Landmark, MapPin, Navigation, Layers, RotateCw } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useState, useCallback, useEffect, useMemo } from 'react';

// --- STYLING & KONFIGURASI ---

const MAP_THEMES = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

// Styling garis batas desa (Earthy Tone)
const getDesaStyle = (isDark) => ({
  fillColor: isDark ? "#5D4037" : "#8D6E63", 
  weight: 3,
  opacity: 0.8,
  color: isDark ? "#8D6E63" : "#5D4037", 
  dashArray: "10, 10", 
  fillOpacity: 0.2
});

// Generator Icon Marker (Warna & Ikon beda tiap kategori)
const createCustomIcon = (kategori) => {
  let colorClass = 'bg-orange-700'; 
  let Icon = MapPin;
  const cat = kategori?.toLowerCase();

  if (cat === 'umkm') { colorClass = 'bg-emerald-700'; Icon = Store; }
  else if (cat === 'wisata') { colorClass = 'bg-amber-600'; Icon = TreePine; }
  else if (cat === 'fasum') { colorClass = 'bg-stone-600'; Icon = Landmark; }

  const iconHtml = renderToStaticMarkup(
    <div className={`${colorClass} p-2 rounded-full shadow-lg border-2 border-[#F5F5DC] ring-2 ring-black/5 scale-110`}>
      <Icon size={16} color="white" />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// --- KOMPONEN UI DI ATAS PETA (OVERLAY) ---

// Toggle ganti mode peta (Terang/Gelap)
const ThemeSwitcher = ({ currentTheme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute top-4 right-4 z-[999] flex flex-col items-end gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl shadow-xl border ${currentTheme === 'dark' ? 'bg-[#2D1B14] border-[#3E2723] text-white' : 'bg-[#F5F5DC] border-[#D7CCC8] text-[#5D4037]'}`}
      >
        <Layers size={20} />
      </button>
      {isOpen && (
        <div className={`p-2 rounded-2xl shadow-2xl border flex flex-col gap-1 ${currentTheme === 'dark' ? 'bg-[#2D1B14] border-[#3E2723]' : 'bg-[#F5F5DC] border-[#D7CCC8]'}`}>
          {['light', 'dark'].map((t) => (
            <button key={t} onClick={() => { setTheme(t); setIsOpen(false); }} className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl ${currentTheme === t ? 'bg-[#5D4037] text-white' : 'text-[#8D6E63]'}`}>
              {t === 'light' ? 'Terang' : 'Malam'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Tombol GPS (Cari lokasi user)
const LocationButton = () => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    map.locate({ setView: false, maxZoom: 16 });
    map.once("locationfound", (e) => {
      setIsLocating(false);
      map.flyTo(e.latlng, 16);
      L.circleMarker(e.latlng, { radius: 8, fillColor: "#A0522D", color: "#fff", weight: 3 }).addTo(map);
    });
    map.once("locationerror", () => { setIsLocating(false); alert("GPS Gagal!"); });
  };

  return (
    <button onClick={handleLocate} className={`fixed bottom-10 right-6 z-[999] p-4 rounded-2xl shadow-2xl border-2 border-[#F5F5DC] ${isLocating ? 'bg-orange-800 animate-pulse' : 'bg-[#5D4037]'}`}>
      <Navigation size={22} className="text-white" />
    </button>
  );
};

// Tombol Refresh (Penting buat PWA/Add to Home Screen biar data Sheets update)
const RefreshButton = () => {
  return (
    <button 
      onClick={() => window.location.reload()}
      className="fixed bottom-28 right-6 z-[999] p-4 rounded-2xl shadow-2xl border-2 border-[#F5F5DC] bg-[#8D6E63]"
    >
      <RotateCw size={22} className="text-white" />
    </button>
  );
};

// --- KOMPONEN UTAMA ---

const MapView = ({ points, onMarkerClick, theme, setTheme }) => {
  const [geoData, setGeoData] = useState(null);
  const centerPosition = [-7.3273, 110.4649]; // Koordinat tengah Desa Gedangan

  // Ambil file batas wilayah desa (GeoJSON)
  useEffect(() => {
    fetch('/batas-gedangan.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.log("GeoJSON Error:", err));
  }, []);

  // Filter & Parsing koordinat dari Spreadsheet (biar presisi & anti-error)
  const markers = useMemo(() => {
    return points.map((spot, i) => {
      const lat = parseFloat(String(spot.latitude || "").replace(',', '.'));
      const lng = parseFloat(String(spot.longitude || "").replace(',', '.'));
      
      if (isNaN(lat) || isNaN(lng)) return null;

      return (
        <Marker 
          key={i} 
          position={[lat, lng]}
          icon={createCustomIcon(spot.kategori_utama)}
          eventHandlers={{ click: () => onMarkerClick(spot) }}
        />
      );
    }).filter(Boolean);
  }, [points, onMarkerClick]);

  return (
    <div className="w-full h-full relative">
      <MapContainer center={centerPosition} zoom={15} className="w-full h-full" zoomControl={false}>
        <TileLayer key={theme} url={MAP_THEMES[theme]} />
        
        {/* Render batas desa kalau filenya ada */}
        {geoData && <GeoJSON data={geoData} style={() => getDesaStyle(theme === 'dark')} />}

        {/* Floating UI Controls */}
        <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
        <RefreshButton />
        <LocationButton />
        
        {/* Tampilkan semua titik UMKM/Wisata */}
        {markers}
      </MapContainer>
    </div>
  );
};

export default MapView;