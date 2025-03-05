import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, MapPin, Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';

interface PrayerTimes {
  maghrib: string;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: {
        en: string;
      };
      year: string;
    };
  };
}

function App() {
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });
  const [maghribTime, setMaghribTime] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; city: string }>({
    latitude: 0,
    longitude: 0,
    city: 'Loading...'
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isIftar, setIsIftar] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [todayHijri, setTodayHijri] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [adhanPlayed, setAdhanPlayed] = useState<boolean>(false);
  const adhanSound = useRef<Howl | null>(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setLocation(prev => ({ ...prev, latitude, longitude }));
            
            // Get city name from coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocation(prev => ({ 
              ...prev, 
              city: data.city || data.locality || 'Unknown Location' 
            }));
            
            // Fetch prayer times
            fetchPrayerTimes(latitude, longitude);
          } catch (err) {
            setError('Failed to get location details. Please try again.');
            setIsLoading(false);
          }
        },
        (err) => {
          setError('Location access denied. Please enable location services to get accurate prayer times.');
          setIsLoading(false);
          // Use default location (Mecca)
          fetchPrayerTimes(21.3891, 39.8579);
          setLocation(prev => ({ ...prev, city: 'Mecca (Default)' }));
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      // Use default location (Mecca)
      fetchPrayerTimes(21.3891, 39.8579);
      setLocation(prev => ({ ...prev, city: 'Mecca (Default)' }));
    }
  }, []);

  // Fetch prayer times from API
  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      const today = new Date();
      const date = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }
      
      const data = await response.json();
      const prayerTimes: PrayerTimes = {
        maghrib: data.data.timings.Maghrib,
        date: data.data.date
      };
      
      setMaghribTime(prayerTimes.maghrib);
      setTodayHijri(`${prayerTimes.date.hijri.date} ${prayerTimes.date.hijri.month.en} ${prayerTimes.date.hijri.year}`);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch prayer times. Please try again later.');
      setIsLoading(false);
    }
  };

  // Calculate countdown
  useEffect(() => {
    if (!maghribTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const [hour, minute] = maghribTime.split(':').map(Number);
      
      const maghribDate = new Date();
      maghribDate.setHours(hour, minute, 0);
      
      // If Maghrib time has already passed today, set isIftar to true
      if (now > maghribDate) {
        setIsIftar(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const diff = maghribDate.getTime() - now.getTime();
      
      // Convert to hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Check if it's Iftar time
      if (diff <= 0) {
        setIsIftar(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setCountdown(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [maghribTime]);

  // Initialize Howler sound on component mount
  useEffect(() => {
    // Create Howl instance once on mount
    adhanSound.current = new Howl({
      src: ['https://www.islamcan.com/audio/adhan/azan2.mp3'], // CDN URL as fallback
      html5: true, // Use HTML5 Audio for better compatibility
      volume: 0.7,
      preload: true,
      onload: () => {
        console.log('Adhan audio loaded successfully');
      },
      onloaderror: (id, err) => {
        console.error('Error loading Adhan:', err);
      },
      onplayerror: (id, err) => {
        console.error('Error playing Adhan:', err);
        // Try to recover by unlocking audio
        if (adhanSound.current) {
          Howler.unload();
          adhanSound.current = new Howl({
            src: ['https://www.islamcan.com/audio/adhan/azan1.mp3'], // Try alternative source
            html5: true,
            volume: 0.7
          });
        }
      }
    });
    
    // Clean up on unmount
    return () => {
      if (adhanSound.current) {
        adhanSound.current.unload();
      }
    };
  }, []);

  // Play Adhan when it's Iftar time
  useEffect(() => {
    if (isIftar && !isMuted && !adhanPlayed && adhanSound.current) {
      try {
        adhanSound.current.play();
        setAdhanPlayed(true);
      } catch (err) {
        console.error('Failed to play Adhan:', err);
      }
    }
  }, [isIftar, isMuted, adhanPlayed]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Format time with leading zeros
  const formatTime = (time: number): string => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  // Handle manual Adhan play
  const handleManualAdhanPlay = () => {
    if (adhanSound.current && !adhanPlayed) {
      try {
        adhanSound.current.play();
        setAdhanPlayed(true);
      } catch (err) {
        console.error('Failed to play Adhan manually:', err);
      }
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (adhanSound.current) {
      if (!isMuted) {
        adhanSound.current.mute(true);
      } else {
        adhanSound.current.mute(false);
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-emerald-50 to-teal-100 text-gray-800'
    }`}>
      <div className="absolute top-4 right-4 flex space-x-4">
        <button 
          onClick={toggleMute} 
          className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
          aria-label={isDarkMode ? "Light mode" : "Dark mode"}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>
      
      <div className={`max-w-md w-full mx-auto p-8 rounded-2xl shadow-xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white/90 backdrop-blur-sm border border-emerald-100'
      }`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            Iftar Countdown
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <p className="text-sm">{location.city}</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : isIftar ? (
            <div className="text-center my-8">
              <div className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                It's Iftar Time!
              </div>
              <p className="text-lg">May Allah accept your fast</p>
              <div className="mt-4 text-sm opacity-80">Maghrib: {maghribTime}</div>
              {!adhanPlayed && (
                <button
                  onClick={handleManualAdhanPlay}
                  className={`mt-4 px-4 py-2 rounded-md ${
                    isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white transition-colors`}
                >
                  Play Adhan
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center gap-4 my-8">
                <div className="flex flex-col items-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {formatTime(countdown.hours)}
                  </div>
                  <div className="text-xs mt-1 uppercase">Hours</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="flex flex-col items-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {formatTime(countdown.minutes)}
                  </div>
                  <div className="text-xs mt-1 uppercase">Minutes</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="flex flex-col items-center">
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {formatTime(countdown.seconds)}
                  </div>
                  <div className="text-xs mt-1 uppercase">Seconds</div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm mb-1">Until Maghrib Prayer</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {maghribTime}
                </p>
              </div>
            </>
          )}
          
          <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className="text-sm opacity-80">{todayHijri}</p>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-sm opacity-70">
        <p>Designed with ❤️ for the Muslim Ummah</p>
      </footer>
    </div>
  );
}

export default App;