import { useState, useEffect, useMemo } from 'react';
import useSheetData from './hooks/useSheetData';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import { Menu, X, Map as MapIcon } from 'lucide-react';

/**
 * COMPONENT: App
 * @description Root component dengan skema warna Earthy (Cokelat/Tanah).
 * Mengatur sinkronisasi data dari Google Sheets dan state tema global.
 */
function App() {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_bz9RYwLbguOr7ldMnd4vX3YQZT_EDKCskpvzFK6RJ85SVJZEy_X8xxarE7JwEzWNjvlrjCnMaX75/pub?gid=1978774550&single=true&output=csv";
  
  const { data, loading } = useSheetData(csvUrl);

  // --- GLOBAL STATES ---
  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' atau 'dark'

  // Effect: Inisialisasi kategori dari data Google Sheets
  useEffect(() => {
    if (data && data.length > 0 && activeCategories.length === 0) {
      const uniqueCats = [...new Set(data.map(item => item.kategori_utama))].filter(Boolean);
      setActiveCategories(uniqueCats);
    }
  }, [data, activeCategories.length]);

  // Handler: Toggle filter kategori UMKM/Wisata
  const toggleCategory = (category) => {
    setActiveCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Memo: Filter data poin berdasarkan kategori yang aktif
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(s => activeCategories.includes(s.kategori_utama));
  }, [data, activeCategories]);

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-[100dvh] w-full transition-colors duration-300 ${isDark ? 'bg-[#1B1212]' : 'bg-[#FAF3E0]'} overflow-hidden relative`}>
      
      {/* HEADER: Navigasi utama dengan warna Earthy Brown */}
      <header className={`p-4 shadow-xl z-[110] flex justify-between items-center shrink-0 border-b transition-colors duration-300 ${
        isDark ? 'bg-[#2D1B14] border-[#3E2723] text-[#D7CCC8]' : 'bg-[#5D4037] border-[#4E342E] text-[#F5F5DC]'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-[#3E2723]' : 'bg-white/10'}`}>
            <MapIcon size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase leading-none">GIS Desa Wisata Gedangan</h1>
        </div>
        
        {/* Mobile Toggle Button (Menu Hamburger) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`md:hidden p-2.5 rounded-xl active:scale-95 transition-all ${
            isDark ? 'bg-[#3E2723] hover:bg-[#4E342E]' : 'bg-[#4E342E]/50 hover:bg-[#3E2723]'
          }`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* SECTION: Map View (Leaflet Container) */}
        <section className="flex-1 relative z-0">
          {!loading ? (
            <MapView 
              points={filteredData} 
              theme={theme}
              setTheme={setTheme}
              onMarkerClick={(spot) => {
                setSelectedSpot(spot);
                if (window.innerWidth < 768) setIsSidebarOpen(false); 
              }} 
            />
          ) : (
            // Loading State: Spinner dengan warna cokelat
            <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-[#1B1212]' : 'bg-[#FAF3E0]'}`}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">Memuat Data Spasial...</p>
              </div>
            </div>
          )}
        </section>

        {/* SECTION: Sidebar (Filter & List UMKM) */}
        <div className={`
          fixed md:relative inset-y-0 right-0 z-[100] w-[85%] sm:w-80 shadow-2xl 
          transform transition-all duration-300 flex flex-col h-full border-l
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
          md:translate-x-0
          ${isDark ? 'bg-[#2D1B14] border-[#3E2723]' : 'bg-white border-[#D7CCC8]'}
        `}>
          <Sidebar 
            data={data} 
            theme={theme}
            activeCategories={activeCategories} 
            toggleCategory={toggleCategory} 
            filteredData={filteredData}
            onSpotClick={(spot) => {
              setSelectedSpot(spot);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Mobile Overlay (Backdrop) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] md:hidden animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </main>

      {/* COMPONENT: Modal Detail (Pop-up informasi UMKM) */}
      {selectedSpot && (
        <Modal 
          spot={selectedSpot} 
          theme={theme} 
          onClose={() => setSelectedSpot(null)} 
        />
      )}
    </div>
  );
}

export default App;