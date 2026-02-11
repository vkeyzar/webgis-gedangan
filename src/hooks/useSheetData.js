import { useState, useEffect } from 'react';
import Papa from 'papaparse';

/**
 * HOOK: useSheetData
 * @description Sinkronisasi data Google Sheets dengan strategi Cache-First.
 * Data dimuat sekali saat aplikasi dibuka untuk menjaga efisiensi baterai & RAM perangkat turis.
 */
const useSheetData = (csvUrl) => {
  // 1. Initial State: Cek cache lokal (LocalStorage) agar data muncul 0ms
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('webgis_cache');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [loading, setLoading] = useState(data.length === 0);

  useEffect(() => {
    /**
     * @function fetchData
     * @description Menarik data terbaru dari Cloud satu kali (saat mounting).
     */
    const fetchData = () => {
      if (!csvUrl) return;

      Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Validasi: Hanya update jika data valid dan tidak kosong
          if (results.data?.length > 0) {
            setData(results.data);
            setLoading(false);
            // Simpan hasil terbaru ke cache untuk penggunaan sesi berikutnya
            localStorage.setItem('webgis_cache', JSON.stringify(results.data));
          }
        },
        error: (err) => console.error("Database Sync Error:", err)
      });
    };

    fetchData();
    // Catatan: Mekanisme Polling (Auto-update) dihilangkan demi stabilitas UX & Resource
  }, [csvUrl]);

  return { data, loading };
};

export default useSheetData;