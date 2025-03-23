import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Scroll, ChevronUp, Search, Filter, BookOpen, Share2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import timelineData from './data/timeline.json';

// Era definitions
const eras = [
  { id: 'all', name: 'Semua Era', years: [0, 3000] },
  { id: 'prophet', name: 'Era Kenabian', years: [570, 632] },
  { id: 'khulafa', name: 'Khulafaur Rasyidin', years: [632, 661] },
  { id: 'umayyah', name: 'Dinasti Umayyah', years: [661, 750] },
  { id: 'abbasiyah', name: 'Dinasti Abbasiyah', years: [750, 1258] },
  { id: 'utsmani', name: 'Kesultanan Utsmani', years: [1299, 1924] }
];

// Create a separate component for timeline items to properly use hooks
function TimelineItem({ event, index, selectedEvent, readEvents, handleEventClick, shareEvent }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <div
      ref={ref}
      key={event.year}
      className={`relative flex items-center mb-8 ${
        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
      } group ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } transition-all duration-500 ease-out`}
    >
      <div className="flex-1">
        <div
          className={`p-6 rounded-lg shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300 cursor-pointer transform group-hover:scale-[1.02] ${
            selectedEvent === index
              ? 'ring-2 ring-emerald-500 dark:ring-emerald-400'
              : ''
          } ${
            readEvents.has(index)
              ? 'border-l-4 border-emerald-500 dark:border-emerald-400'
              : ''
          }`}
          onClick={() => handleEventClick(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleEventClick(index);
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={selectedEvent === index}
        >
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {event.year} M
              </span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {event.event}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shareEvent(event);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {event.description}
          </p>
        </div>
      </div>
      <div className="w-16 flex justify-center">
        <div className={`w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-400 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition-transform duration-300 ${
          readEvents.has(index) ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''
        }`}></div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [readEvents, setReadEvents] = useState<Set<number>>(new Set());

  // Progress calculation
  const progress = Math.round((readEvents.size / timelineData.length) * 100);

  useEffect(() => {
    // Load read events from localStorage
    const savedReadEvents = localStorage.getItem('readEvents');
    if (savedReadEvents) {
      setReadEvents(new Set(JSON.parse(savedReadEvents)));
    }
  }, []);

  useEffect(() => {
    // Save read events to localStorage
    localStorage.setItem('readEvents', JSON.stringify(Array.from(readEvents)));
  }, [readEvents]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setShowSearch(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredEvents = useMemo(() => {
    return timelineData.filter(event => {
      const matchesSearch = 
        event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.year.toString().includes(searchTerm);
      
      if (selectedEra === 'all') return matchesSearch;
      
      const era = eras.find(e => e.id === selectedEra);
      return matchesSearch && 
        event.year >= (era?.years[0] || 0) && 
        event.year <= (era?.years[1] || 3000);
    });
  }, [searchTerm, selectedEra]);

  const handleEventClick = (index: number) => {
    setSelectedEvent(index === selectedEvent ? null : index);
    if (!readEvents.has(index)) {
      setReadEvents(new Set([...readEvents, index]));
    }
  };

  const shareEvent = async (event: { year: number; event: string; description: string }) => {
    const text = `${event.year} M - ${event.event}\n${event.description}\n\nDari Timeline Sejarah Islam`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Timeline Sejarah Islam',
          text: text,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
      alert('Teks telah disalin ke clipboard!');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300`}>
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Scroll className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 text-transparent bg-clip-text">
                Sejarah Islam
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <BookOpen className="inline-block w-4 h-4 mr-1" />
                {progress}% Dibaca
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
          
          <div className={`transition-all duration-300 ${showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari peristiwa sejarah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                />
              </div>
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              >
                {eras.map(era => (
                  <option key={era.id} value={era.id}>{era.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-36 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Timeline Sejarah Islam
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Perjalanan sejarah Islam dari masa Nabi Muhammad ﷺ hingga era modern, 
              mencakup berbagai peristiwa penting yang membentuk peradaban Islam.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200 dark:bg-emerald-900"></div>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Tidak ada peristiwa yang sesuai dengan pencarian Anda.
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <TimelineItem
                  key={event.year}
                  event={event}
                  index={index}
                  selectedEvent={selectedEvent}
                  readEvents={readEvents}
                  handleEventClick={handleEventClick}
                  shareEvent={shareEvent}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-4 p-3 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-600 dark:hover:bg-emerald-700 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            RamadhanJS Challenge - Aditya Fakhri Riansyah
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;