import { X, MapPin, Clock, Phone, ArrowRight, Info } from 'lucide-react';

/**
 * COMPONENT: Modal
 * @description Detail informasi UMKM/Spot dengan tema Cokelat.
 * FIX: Responsivitas mobile (max-height & scroll) agar tidak overflow.
 */
const Modal = ({ spot, theme, onClose }) => {
  if (!spot) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`
        w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 rounded-[2rem] border
        animate-in slide-in-from-bottom-10 duration-500 custom-scrollbar
        ${isDark ? 'bg-[#1B1212] border-[#3E2723]' : 'bg-white border-[#D7CCC8]'}
      `}>
        
        {/* HEADER: Gradient Cokelat Kayu */}
        <div className={`p-8 relative transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-[#2D1B14] to-[#1B1212] border-b border-[#3E2723]' 
            : 'bg-gradient-to-br from-[#5D4037] to-[#8B4513]'
        }`}>
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/20 active:scale-90"
          >
            <X size={18} />
          </button>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border transition-all ${
                isDark 
                  ? 'bg-[#3E2723]/50 text-[#BC8F8F] border-[#BC8F8F]/30' 
                  : 'bg-white/20 text-white border-white/30 backdrop-blur-md'
              }`}>
                {spot.kategori_utama}
              </span>
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest transition-all ${
                isDark 
                  ? 'bg-[#BC8F8F]/20 text-[#D7CCC8]' 
                  : 'bg-[#A1887F]/30 text-[#FAF3E0]'
              }`}>
                {spot.sub_kategori || 'Info Desa'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight tracking-tighter">
              {spot.nama_spot}
            </h2>
          </div>
        </div>

        {/* CONTENT: Info Area */}
        <div className={`p-8 space-y-6 transition-colors duration-300 ${
          isDark ? 'bg-[#1B1212]' : 'bg-[#FAF3E0]/30'
        }`}>
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${isDark ? 'text-[#BC8F8F]' : 'text-[#8B4513]'}`}>
                <Clock size={14} strokeWidth={3} />
                <p className="text-[9px] font-black uppercase opacity-60">Operasional</p>
              </div>
              <p className={`text-sm font-bold ml-5 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                {spot.jam_operasional || 'Setiap Hari'}
              </p>
            </div>
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${isDark ? 'text-[#BC8F8F]' : 'text-[#8B4513]'}`}>
                <Phone size={14} strokeWidth={3} />
                <p className="text-[9px] font-black uppercase opacity-60">Kontak</p>
              </div>
              <p className={`text-sm font-bold ml-5 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                {spot.kontak || '-'}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#BC8F8F]' : 'text-[#8B4513]'}`}>
              <MapPin size={14} strokeWidth={3} />
              <p className="text-[9px] font-black uppercase opacity-60">Alamat</p>
            </div>
            <p className={`text-sm leading-relaxed font-medium ml-5 ${isDark ? 'text-[#A1887F]' : 'text-[#5D4037]/80'}`}>
              {spot.alamat}
            </p>
          </div>

          {/* About Box */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2 ${
            isDark ? 'bg-[#2D1B14] border-[#3E2723]' : 'bg-white border-[#D7CCC8] shadow-sm'
          }`}>
            <div className="flex items-center gap-2 opacity-40">
              <Info size={12} />
              <p className="text-[9px] font-black uppercase">Deskripsi</p>
            </div>
            <p className={`text-xs leading-relaxed italic ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
              "{spot.deskripsi || 'Belum ada deskripsi untuk lokasi ini.'}"
            </p>
          </div>

          {/* Navigation CTA (Warna Cokelat Gelap) */}
          <a 
            href={spot.link_gmaps} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              flex items-center justify-center gap-3 w-full font-black py-4 rounded-xl transition-all group active:scale-[0.97]
              ${isDark 
                ? 'bg-[#5D4037] hover:bg-[#8B4513] text-white shadow-lg shadow-black/40' 
                : 'bg-[#5D4037] hover:bg-[#3E2723] text-white shadow-xl shadow-[#5D4037]/20'}
            `}
          >
            BUKA DI GOOGLE MAPS
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Modal;