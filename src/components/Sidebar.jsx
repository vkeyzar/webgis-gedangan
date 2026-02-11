import { Filter, ChevronRight, ChevronDown, CheckSquare, Square, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';

/**
 * COMPONENT: Sidebar
 * @description Sidebar interaktif untuk filter kategori dan pencarian UMKM.
 * Menggunakan skema warna cokelat (earthy tone) untuk Light & Dark mode.
 */
const Sidebar = ({ data, theme, activeCategories, toggleCategory, filteredData, onSpotClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubCategories, setActiveSubCategories] = useState([]);

  const isDark = theme === 'dark';

  /**
   * Mengambil daftar unik kategori utama dari dataset Google Sheets.
   * FIX: Menambahkan kurung siku [] pada Array spread.
   */
  const categories = useMemo(() => 
    [...new Set(data.map(item => item.kategori_utama))].filter(Boolean)
  , [data]);

  /**
   * Logic Filter: Menggabungkan filter kategori utama, sub-kategori, dan kolom pencarian.
   */
  const finalFilteredData = useMemo(() => {
    return filteredData.filter(spot => {
      const matchesSearch = 
        spot.nama_spot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.kategori_utama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.sub_kategori?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubCat = activeSubCategories.length === 0 || activeSubCategories.includes(spot.sub_kategori);

      return matchesSearch && matchesSubCat;
    });
  }, [filteredData, searchTerm, activeSubCategories]);

  return (
    <aside className={`flex flex-col h-full w-full overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#1B1212] border-[#3E2723]' : 'bg-white border-[#D7CCC8]'
    }`}>
      
      {/* --- SEARCH SECTION --- */}
      <div className={`p-5 border-b shrink-0 transition-colors ${
        isDark ? 'bg-[#1B1212] border-[#3E2723]' : 'bg-white border-[#F5F5DC]'
      }`}>
        <div className="relative group">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            isDark ? 'text-[#8D6E63] group-focus-within:text-[#BC8F8F]' : 'text-[#8B4513] group-focus-within:text-[#5D4037]'
          }`} />
          <input
            type="text"
            placeholder="Cari lokasi desa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm outline-none transition-all border ${
              isDark 
                ? 'bg-[#2D1B14] border-[#3E2723] text-[#D7CCC8] focus:border-[#8D6E63]' 
                : 'bg-[#FAF3E0] border-[#D7CCC8] text-[#5D4037] focus:border-[#8B4513]'
            }`}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* --- SCROLLABLE BODY --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* FILTER CATEGORY */}
        <div className={`p-5 border-b transition-colors ${
          isDark ? 'bg-[#2D1B14]/30 border-[#3E2723]' : 'bg-[#FAF3E0]/30 border-[#F5F5DC]'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className={isDark ? 'text-[#BC8F8F]' : 'text-[#8B4513]'} strokeWidth={3} />
            <h3 className={`font-black text-[9px] tracking-widest uppercase ${isDark ? 'text-[#8D6E63]' : 'text-[#A1887F]'}`}>
              Filter Kategori
            </h3>
          </div>
          
          <div className="space-y-2">
            {categories.map(cat => {
              const isActive = activeCategories.includes(cat);
              const subCategories = [...new Set(data.filter(item => item.kategori_utama === cat).map(item => item.sub_kategori))].filter(Boolean);

              return (
                <div key={cat} className="space-y-1">
                  <label className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#5D4037] border-[#5D4037] text-[#F5F5DC] shadow-lg' 
                      : isDark ? 'bg-[#2D1B14] border-[#3E2723] text-[#D7CCC8]' : 'bg-white border-[#D7CCC8] text-[#5D4037]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isActive} onChange={() => toggleCategory(cat)} className="hidden" />
                      {isActive ? <CheckSquare size={16} /> : <Square size={16} className="opacity-30" />}
                      <span className="text-[11px] font-black uppercase">{cat}</span>
                    </div>
                    {isActive && subCategories.length > 0 && <ChevronDown size={14} />}
                  </label>

                  {/* SUB-CATEGORY RENDER */}
                  {isActive && subCategories.map(sub => (
                    <label key={sub} className={`flex items-center gap-2 pl-9 p-2 rounded-xl cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-[#2D1B14]' : 'hover:bg-[#FAF3E0]'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={activeSubCategories.includes(sub)}
                        onChange={() => setActiveSubCategories(prev => 
                          prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
                        )}
                        className="w-4 h-4 rounded border-[#D7CCC8] text-[#8B4513] focus:ring-[#8B4513]"
                      />
                      <span className={`text-[10px] font-bold uppercase ${
                        activeSubCategories.includes(sub) ? 'text-[#8B4513]' : 'text-[#A1887F]'
                      }`}>
                        {sub}
                      </span>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* LIST RESULTS */}
        <div className={isDark ? 'bg-[#1B1212]' : 'bg-white'}>
          <div className={`px-5 py-3 border-b sticky top-0 backdrop-blur-sm z-10 flex justify-between items-center transition-colors ${
            isDark ? 'bg-[#1B1212]/90 border-[#3E2723]' : 'bg-white/95 border-[#FAF3E0]'
          }`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#D7CCC8]">
              Total: {finalFilteredData.length} Lokasi
            </p>
          </div>

          {finalFilteredData.length > 0 ? (
            finalFilteredData.map((spot, i) => (
              <div 
                key={i} 
                onClick={() => onSpotClick(spot)}
                className={`p-5 border-b transition-all cursor-pointer group flex justify-between items-center ${
                  isDark ? 'border-[#3E2723] hover:bg-[#2D1B14]' : 'border-[#FAF3E0] hover:bg-[#FAF3E0]/50'
                }`}
              >
                <div className="flex-1 pr-4">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase mb-2 inline-block ${
                    isDark ? 'text-[#BC8F8F] bg-[#3E2723]' : 'text-[#8B4513] bg-[#FAF3E0]'
                  }`}>
                    {spot.sub_kategori || 'Umum'}
                  </span>
                  <h4 className={`font-bold text-sm leading-tight ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                    {spot.nama_spot}
                  </h4>
                </div>
                <ChevronRight size={14} className="text-[#D7CCC8] group-hover:translate-x-1 transition-transform" />
              </div>
            ))
          ) : (
            <div className="p-12 text-center opacity-30">
              <Search size={32} className="mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase">Tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;