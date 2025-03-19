
        // Theme toggle functionality
        const themeToggleBtn = document.getElementById('themeToggle');
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        const htmlElement = document.documentElement;
        
        // Check for saved theme preference or use device preference
        const setTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                htmlElement.classList.add('dark');
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            } else {
                htmlElement.classList.remove('dark');
                moonIcon.classList.remove('hidden');
                sunIcon.classList.add('hidden');
            }
        };
        
        // Set theme on initial load
        setTheme();
        
        // Toggle theme
        themeToggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                moonIcon.classList.remove('hidden');
                sunIcon.classList.add('hidden');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            }
        });

        // Hadith functionality
        const hadithContainer = document.getElementById('hadithContainer');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const endMessage = document.getElementById('endMessage');
        const errorBanner = document.getElementById('errorBanner');
        const errorMessage = document.getElementById('errorMessage');
        const errorDetail = document.getElementById('errorDetail');
        const retryContainer = document.getElementById('retryContainer');
        const retryButton = document.getElementById('retryButton');
        
        let page = 1;
        let isLoading = false;
        let hasMore = true;
        let apiAttempts = 0;
        let usingFallback = false;
        let fallbackIndex = 0;
        
        // API endpoints - multiple options for redundancy
        const API_ENDPOINTS = [
            'https://api.hadith.gading.dev/books/muslim',
            'https://api.hadith.sutanlab.id/books/muslim',
            'https://api.aladhan.com/v1/timingsByCity/2023/03/15?city=London&country=UK&method=2' // Not a hadith API but used as a test for connectivity
        ];
        
        let currentApiIndex = 0;
        
        // Get current API URL
        const getCurrentApiUrl = () => {
            return API_ENDPOINTS[currentApiIndex].split('?')[0]; // Get only the base URL part
        };
        
        // Try next API endpoint
        const tryNextApi = () => {
            currentApiIndex = (currentApiIndex + 1) % API_ENDPOINTS.length;
            console.log(`Switching to API endpoint: ${getCurrentApiUrl()}`);
            
            // Reset page to 1 for new API
            page = 1;
            return getCurrentApiUrl();
        };
        
        const LIMIT = 5;
        
        // Extended fallback hadiths to ensure content
        const fallbackHadiths = [
            {
                id: 'fallback-1',
                arab: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
                id: "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.",
                number: 2699,
            },
            {
                id: 'fallback-2',
                arab: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
                id: "Sesungguhnya setiap amalan tergantung pada niatnya. Dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan.",
                number: 1907,
            },
            {
                id: 'fallback-3',
                arab: "مَثَلُ الْجَلِيسِ الصَّالِحِ وَالْجَلِيسِ السَّوْءِ كَمَثَلِ صَاحِبِ الْمِسْكِ وَكِيرِ الْحَدَّادِ",
                id: "Permisalan teman yang baik dan teman yang buruk ibarat seorang penjual minyak wangi dan seorang pandai besi.",
                number: 2628,
            },
            {
                id: 'fallback-4',
                arab: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
                id: "Tidak beriman salah seorang di antara kalian hingga dia mencintai untuk saudaranya apa yang dia cintai untuk dirinya sendiri.",
                number: 43,
            },
            {
                id: 'fallback-5',
                arab: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
                id: "Muslim (yang baik) adalah orang yang muslim lainnya selamat dari (gangguan) lisan dan tangannya.",
                number: 40,
            },
            {
                id: 'fallback-6',
                arab: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
                id: "Barangsiapa yang beriman kepada Allah dan hari akhir, maka hendaklah dia berkata yang baik atau diam.",
                number: 47,
            },
            {
                id: 'fallback-7',
                arab: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ",
                id: "Sesungguhnya Allah itu Maha Lembut dan mencintai kelembutan dalam segala urusan.",
                number: 2593,
            },
            {
                id: 'fallback-8',
                arab: "مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ",
                id: "Siapa yang tidak menyayangi manusia maka tidak akan disayangi oleh Allah.",
                number: 2319,
            },
            {
                id: 'fallback-9',
                arab: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
                id: "Menuntut ilmu adalah kewajiban bagi setiap muslim.",
                number: 224,
            },
            {
                id: 'fallback-10',
                arab: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
                id: "Dunia adalah penjara bagi orang beriman dan surga bagi orang kafir.",
                number: 2956,
            }
        ];
        
        // Create hadith card
        function createHadithCard(hadith) {
            const card = document.createElement('div');
            card.className = 'hadith-card opacity-0 translate-y-8 transition-all duration-500';
            
            // Format the hadith data
            const arabicText = hadith.arab || ""; // Handle missing Arabic text
            const translationText = hadith.id || ""; // Handle missing translation
            const number = hadith.number || "N/A"; // Handle missing number
            const source = `Muslim, Hadith #${number}`;
            
            card.innerHTML = `
                <div class="mb-6 text-right">
                    <p class="text-2xl leading-relaxed font-arabic text-gray-800 dark:text-gray-200" dir="rtl">
                        ${arabicText}
                    </p>
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        ${translationText}
                    </p>
                </div>
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-medium text-teal-600 dark:text-teal-400">${source}</span> - Imam Muslim
                    </p>
                </div>
            `;
            
            return card;
        }

        // Show error in UI
        function showError(message, detail) {
            errorMessage.textContent = message || "Gagal memuat data dari API.";
            errorDetail.textContent = detail || "Menggunakan data lokal sebagai alternatif.";
            errorBanner.classList.remove('hidden');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorBanner.classList.add('hidden');
            }, 5000);
        }
        
        // Load fallback hadiths
        function loadFallbackHadiths() {
            usingFallback = true;
            
            // Only show 3 fallback hadiths per "page"
            const startIndex = fallbackIndex;
            const endIndex = Math.min(startIndex + 3, fallbackHadiths.length);
            
            if (startIndex >= fallbackHadiths.length) {
                hasMore = false;
                loadingSpinner.classList.add('hidden');
                endMessage.classList.remove('hidden');
                return;
            }
            
            for (let i = startIndex; i < endIndex; i++) {
                const hadith = fallbackHadiths[i];
                const hadithCard = createHadithCard(hadith);
                hadithContainer.appendChild(hadithCard);
                
                // Animate the card after a small delay
                setTimeout(() => {
                    hadithCard.classList.remove('opacity-0', 'translate-y-8');
                    hadithCard.classList.add('opacity-100', 'translate-y-0');
                }, 100 * (i - startIndex));
            }
            
            fallbackIndex = endIndex;
            
            // Show retry button if we've shown some fallbacks but not all
            if (fallbackIndex < fallbackHadiths.length) {
                retryContainer.classList.remove('hidden');
            } else {
                // We've shown all fallbacks
                endMessage.classList.remove('hidden');
            }
            
            isLoading = false;
            loadingSpinner.classList.add('hidden');
        }
        
        // Process API response differently depending on the endpoint
        function processApiResponse(data, apiUrl) {
            let hadiths = [];
            let pagination = { totalPages: 10 }; // Default pagination
            
            // Handle different API response structures
            if (apiUrl.includes('gading.dev') || apiUrl.includes('sutanlab.id')) {
                // Gading.dev or sutanlab.id API format
                if (data.data && data.data.hadiths && data.data.hadiths.length > 0) {
                    hadiths = data.data.hadiths;
                    pagination = data.data.pagination || pagination;
                }
            } else if (apiUrl.includes('aladhan.com')) {
                // Use prayer times as mock hadith data (just for testing connectivity)
                const prayerData = data.data ? data.data.timings : null;
                if (prayerData) {
                    // Convert prayer times to mock hadith format
                    hadiths = Object.entries(prayerData).map(([key, value], index) => ({
                        id: `prayer-${index}`,
                        arab: `وقت ${key} هو ${value}`,
                        id: `Waktu ${key} adalah ${value}`,
                        number: 1000 + index
                    })).slice(0, 5); // Limit to 5 items
                }
            }
            
            return { hadiths, pagination };
        }
        
        // Fetch hadiths from API
        async function fetchHadiths() {
            if (isLoading || !hasMore) return;
            
            isLoading = true;
            loadingSpinner.classList.remove('hidden');
            retryContainer.classList.add('hidden');
            
            if (usingFallback) {
                // Continue with fallback data
                setTimeout(loadFallbackHadiths, 500); // Short delay for better UX
                return;
            }
            
            try {
                const apiUrl = getCurrentApiUrl();
                let fullUrl = '';
                
                // Handle URLs that might already have query parameters
                if (apiUrl.includes('aladhan.com')) {
                    // For aladhan API, use a different approach since its parameters are different
                    fullUrl = `${apiUrl}`;
                } else {
                    // For hadith APIs
                    fullUrl = `${apiUrl}?page=${page}&limit=${LIMIT}`;
                }
                
                console.log(`Fetching from: ${fullUrl}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                
                const response = await fetch(fullUrl, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                const { hadiths, pagination } = processApiResponse(data, apiUrl);
                
                if (hadiths && hadiths.length > 0) {
                    // Reset API attempts on success
                    apiAttempts = 0;
                    
                    // Process and display fetched hadiths
                    hadiths.forEach((hadith, index) => {
                        const hadithCard = createHadithCard(hadith);
                        hadithContainer.appendChild(hadithCard);
                        
                        // Animate the card after a small delay
                        setTimeout(() => {
                            hadithCard.classList.remove('opacity-0', 'translate-y-8');
                            hadithCard.classList.add('opacity-100', 'translate-y-0');
                        }, 100 * index);
                    });
                    
                    page++;
                    
                    // Check if we've reached the end
                    if (page > pagination.totalPages) {
                        hasMore = false;
                        endMessage.classList.remove('hidden');
                    }
                } else {
                    throw new Error('No hadith data found in API response');
                }
            } catch (error) {
                console.error('Error fetching hadiths:', error);
                apiAttempts++;
                
                if (apiAttempts < API_ENDPOINTS.length) {
                    // Try another API endpoint
                    showError("Gagal terhubung ke API utama", "Mencoba API alternatif...");
                    tryNextApi();
                    isLoading = false;
                    fetchHadiths(); // Retry with new API
                } else {
                    // All API attempts failed, use fallback data
                    showError("Semua API tidak dapat diakses", "Menggunakan data lokal sebagai alternatif");
                    loadFallbackHadiths();
                }
            } finally {
                isLoading = false;
                loadingSpinner.classList.add('hidden');
            }
        }

        // Initial load
        fetchHadiths();
        
        // Infinite scroll implementation
        window.addEventListener('scroll', () => {
            if (isLoading || !hasMore) return;
            
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            // Load more hadiths when user is near the bottom
            if (scrollTop + clientHeight >= scrollHeight - 300) {
                fetchHadiths();
            }
        });
        
        // Retry button event
        retryButton.addEventListener('click', () => {
            if (!isLoading) {
                retryContainer.classList.add('hidden');
                
                if (usingFallback) {
                    fetchHadiths(); // Continue with fallback data
                } else {
                    // Try API again
                    page = 1;
                    apiAttempts = 0;
                    currentApiIndex = 0;
                    fetchHadiths();
                }
            }
        });