
        // Quote Data
        const quotes = [
            {
                content: "Ramadhan adalah bulan kesabaran, dan balasan kesabaran adalah surga.",
                author: "Imam Ali"
            },
            {
                content: "Barangsiapa berpuasa di bulan Ramadhan dengan iman dan mengharap ridha Allah, maka dosanya yang telah lalu akan diampuni.",
                author: "HR. Bukhari & Muslim"
            },
            {
                content: "Ramadhan mengajarkan kita untuk berempati dengan saudara-saudara kita yang kurang beruntung.",
                author: "Anonim"
            },
            {
                content: "Bulan Ramadhan adalah bulan yang penuh berkah, bulan yang di dalamnya diturunkan Al-Quran.",
                author: "QS. Al-Baqarah: 185"
            },
            {
                content: "Di bulan Ramadhan, pintu-pintu surga dibuka, pintu-pintu neraka ditutup, dan setan-setan dibelenggu.",
                author: "HR. Bukhari & Muslim"
            },
            {
                content: "Puasa bukanlah sekedar menahan lapar dan haus, tetapi juga menahan diri dari perkataan dan perbuatan yang sia-sia.",
                author: "Imam Al-Ghazali"
            },
            {
                content: "Ramadhan adalah bulan dimana Allah menggandakan pahala amal kebaikan.",
                author: "Anonim"
            },
            {
                content: "Saat berpuasa, anda merasa lapar dan haus, itulah saat anda harus mengingat betapa berharganya makanan dan minuman.",
                author: "Anonim"
            },
            {
                content: "Jadikan Ramadhan sebagai bulan untuk membersihkan hati dan pikiran dari segala hal yang tidak baik.",
                author: "Anonim"
            },
            {
                content: "Ramadhan adalah kesempatan terbaik untuk memperbaiki hubungan dengan Allah dan sesama manusia.",
                author: "Anonim"
            },
            {
                content: "Beruntunglah mereka yang menjadikan Ramadhan sebagai momen untuk bertaubat dan kembali kepada Allah SWT.",
                author: "Anonim"
            },
            {
                content: "Ramadhan adalah sekolah spiritual tahunan untuk meningkatkan kualitas keimanan dan ketakwaan.",
                author: "Anonim"
            }
        ];

        // Function to get random quote
        function getRandomQuote() {
            try {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                const data = quotes[randomIndex];
                
                document.getElementById("quoteText").innerText = `"${data.content}"`;
                document.getElementById("quoteSource").innerText = `- ${data.author}`;
            } catch (error) {
                console.error("Error menampilkan quote:", error);
                document.getElementById("quoteText").innerText = "Gagal memuat quote, coba lagi.";
                document.getElementById("quoteSource").innerText = "";
            }
        }

        // Clock functionality
        function updateClock() {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            
            // Add leading zeros
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            
            const timeString = `${hours}:${minutes}:${seconds}`;
            document.getElementById('clockDisplay').textContent = timeString;
            
            setTimeout(updateClock, 1000);
        }

        // Theme toggle functionality
        function setupThemeToggle() {
            const themeToggleBtn = document.getElementById('themeToggle');
            
            // Check for saved theme preference or respect OS preference
            if (localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            // Toggle theme on button click
            themeToggleBtn.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }

        // Prayer times API functionality
        async function getPrayerTimes(latitude, longitude) {
            try {
                const today = new Date();
                const month = today.getMonth() + 1;
                const year = today.getFullYear();
                
                const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=11`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.code === 200 && data.data) {
                    const day = today.getDate() - 1; // API uses 0-indexed days
                    const timings = data.data[day].timings;
                    
                    // Update prayer times
                    document.getElementById('fajrTime').textContent = timings.Fajr.split(" ")[0];
                    document.getElementById('dhuhrTime').textContent = timings.Dhuhr.split(" ")[0];
                    document.getElementById('asrTime').textContent = timings.Asr.split(" ")[0];
                    document.getElementById('maghribTime').textContent = timings.Maghrib.split(" ")[0];
                    document.getElementById('ishaTime').textContent = timings.Isha.split(" ")[0];
                }
            } catch (error) {
                console.error("Error fetching prayer times:", error);
                document.getElementById('prayerTimesContainer').innerHTML = 
                    '<div class="col-span-5 text-center p-4 text-red-500">Gagal memuat jadwal sholat. Silakan coba lagi nanti.</div>';
            }
        }

        // Get location and use backup if needed
        async function getLocation() {
            try {
                // Try to get user location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        // Success callback
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            await getPrayerTimes(latitude, longitude);
                            
                            // Get city name
                            try {
                                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                const data = await response.json();
                                let cityName = data.address.city || data.address.town || data.address.village || data.address.county || "Lokasi Anda";
                                document.getElementById('cityName').textContent = cityName;
                            } catch (error) {
                                document.getElementById('cityName').textContent = "Lokasi dideteksi";
                            }
                        },
                        // Error callback - use default location (Jakarta)
                        (error) => {
                            console.warn("Geolocation error:", error);
                            useDefaultLocation();
                        }
                    );
                } else {
                    // Geolocation not supported - use default location
                    console.warn("Geolocation not supported by this browser");
                    useDefaultLocation();
                }
            } catch (error) {
                console.error("Location error:", error);
                useDefaultLocation();
            }
        }

        // Use Jakarta as default location
        function useDefaultLocation() {
            // Jakarta coordinates
            const jakartaLat = -6.2088;
            const jakartaLon = 106.8456;
            
            getPrayerTimes(jakartaLat, jakartaLon);
            document.getElementById('cityName').textContent = "Jakarta (default)";
        }

        // Fallback prayer times in case API fails
        function setFallbackPrayerTimes() {
            const prayerTimesContainer = document.getElementById('prayerTimesContainer');
            const fallbackHTML = `
                <div class="col-span-5 text-center p-4">
                    <p class="mb-2 text-yellow-600 dark:text-yellow-400">⚠️ Menggunakan jadwal perkiraan</p>
                    <div class="grid grid-cols-5 gap-3">
                        <div class="text-center">
                            <div class="text-primary-dark dark:text-primary-light font-medium">Subuh</div>
                            <div class="text-xl font-mono">04:30</div>
                        </div>
                        <div class="text-center">
                            <div class="text-primary-dark dark:text-primary-light font-medium">Dzuhur</div>
                            <div class="text-xl font-mono">12:00</div>
                        </div>
                        <div class="text-center">
                            <div class="text-primary-dark dark:text-primary-light font-medium">Ashar</div>
                            <div class="text-xl font-mono">15:15</div>
                        </div>
                        <div class="text-center">
                            <div class="text-primary-dark dark:text-primary-light font-medium">Maghrib</div>
                            <div class="text-xl font-mono">18:00</div>
                        </div>
                        <div class="text-center">
                            <div class="text-primary-dark dark:text-primary-light font-medium">Isya</div>
                            <div class="text-xl font-mono">19:15</div>
                        </div>
                    </div>
                </div>
            `;
            prayerTimesContainer.innerHTML = fallbackHTML;
        }

        // Initialize everything
        document.addEventListener("DOMContentLoaded", function() {
            // Initialize quote generator
            document.getElementById("generateQuote").addEventListener("click", getRandomQuote);
            getRandomQuote(); // Show initial quote
            
            // Initialize clock
            updateClock();
            
            // Setup theme toggle
            setupThemeToggle();
            
            // Get prayer times
            getLocation().catch(error => {
                console.error("Failed to initialize location:", error);
                setFallbackPrayerTimes();
            });
            
            // Set a timeout for prayer times API
            setTimeout(() => {
                const fajrTime = document.getElementById('fajrTime');
                if (fajrTime.textContent === '--:--') {
                    setFallbackPrayerTimes();
                }
            }, 5000);
        });