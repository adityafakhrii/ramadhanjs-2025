import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Navbar } from './components/Navbar';
import { HadithCard } from './components/HadithCard';
import { Footer } from './components/Footer';
import type { Hadith } from './types';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const fetchHadiths = async () => {
    try {
      const startRange = ((page - 1) * ITEMS_PER_PAGE) + 1;
      const endRange = page * ITEMS_PER_PAGE;
      const response = await fetch(`https://api.hadith.gading.dev/books/muslim?range=${startRange}-${endRange}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data.hadiths)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedHadiths: Hadith[] = data.data.hadiths.map((hadith: any) => ({
          number: hadith.number,
          arab: hadith.arab,
          id: hadith.id,
          narrator: hadith.narrator || 'Unknown',
          sanad: hadith.sanad || ''
        }));
        
        setHadiths(prev => [...prev, ...formattedHadiths]);
        setHasMore(formattedHadiths.length === ITEMS_PER_PAGE);
        setPage(prev => prev + 1);
      } else {
        console.error('Unexpected API response structure:', data);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchHadiths();
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200`}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
            Temukan Hadits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Jelajahi koleksi hadits sahih dengan pengalaman membaca yang nyaman. Gulir ke bawah untuk menemukan lebih banyak hadits.
          </p>
        </div>

        <InfiniteScroll
          dataLength={hadiths.length}
          next={fetchHadiths}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Memuat hadits...</div>}
          endMessage={<div className="text-center py-4">Tidak ada hadits lagi.</div>}
          className="space-y-6"
        >
          {hadiths.map((hadith, index) => (
            <HadithCard key={hadith.number} hadith={hadith} index={index} />
          ))}
        </InfiniteScroll>
      </main>

      <Footer />
    </div>
  );
}

export default App;