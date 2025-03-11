

        // API Keys & Config
        const API_KEY = "ac9827e70b4fe472dbc20ce49bc81b9d"; // Silakan ganti dengan API key Anda
        const BASE_URL = "https://api.openweathermap.org/data/2.5";
        
        // DOM Elements
        const darkModeToggle = document.getElementById('darkModeToggle');
        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const locationBtn = document.getElementById('locationBtn');
        const welcomeLocationBtn = document.getElementById('welcomeLocationBtn');
        const welcomeSearchBtn = document.getElementById('welcomeSearchBtn');
        const errorMessage = document.getElementById('errorMessage');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const weatherInfo = document.getElementById('weatherInfo');
        const welcomeMessage = document.getElementById('welcomeMessage');
        const recentSearches = document.getElementById('recentSearches');
        const recentSearchesList = document.getElementById('recentSearchesList');
        const weatherAlerts = document.getElementById('weatherAlerts');
        const alertTitle = document.getElementById('alertTitle');
        const alertDescription = document.getElementById('alertDescription');
        const shareBtn = document.getElementById('shareBtn');
        
        // Weather Elements
        const cityName = document.getElementById('cityName');
        const countryCode = document.getElementById('countryCode');
        const dateTime = document.getElementById('dateTime');
        const weatherIcon = document.getElementById('weatherIcon');
        const temperature = document.getElementById('temperature');
        const weatherDescription = document.getElementById('weatherDescription');
        const feelsLike = document.getElementById('feelsLike');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('windSpeed');
        const pressure = document.getElementById('pressure');
        const hourlyForecast = document.getElementById('hourlyForecast');
        const weeklyForecast = document.getElementById('weeklyForecast');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        const visibility = document.getElementById('visibility');
        const uvIndex = document.getElementById('uvIndex');
        const aqiValue = document.getElementById('aqiValue');
        const aqiDescription = document.getElementById('aqiDescription');
        const aqiIcon = document.getElementById('aqiIcon');
        const aqiBar = document.getElementById('aqiBar');
        
        // Theme Toggle
        function toggleDarkMode() {
            document.body.classList.toggle('darkmode');
            localStorage.setItem('darkMode', document.body.classList.contains('darkmode'));
        }
        
        // Check for saved theme preference
        if (localStorage.getItem('darkMode') === 'true' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'))) {
            document.body.classList.add('darkmode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', toggleDarkMode);
        
        // Helper Functions
        function showLoading() {
            loadingIndicator.classList.remove('hidden');
            weatherInfo.classList.add('hidden');
            welcomeMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
            weatherAlerts.classList.add('hidden');
        }
        
        function hideLoading() {
            loadingIndicator.classList.add('hidden');
        }
        
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
            hideLoading();
        }
        
        function showWeatherInfo() {
            weatherInfo.classList.remove('hidden');
            welcomeMessage.classList.add('hidden');
            hideLoading();
        }
        
        function formatDate(timestamp, timezone) {
            const date = new Date((timestamp + timezone) * 1000);
            const options = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'UTC',
            timeZoneOffset: timezone / 3600
            };
            return date.toLocaleString('id-ID', options);
        }
        
        function formatTime(timestamp, timezone) {
            const date = new Date((timestamp + timezone) * 1000);
            return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'UTC',
            timeZoneOffset: timezone / 3600
            });
        }
        
        function formatDay(timestamp, timezone) {
            const date = new Date((timestamp + timezone) * 1000);
            return date.toLocaleDateString('id-ID', { 
            weekday: 'short',
            timeZone: 'UTC',
            timeZoneOffset: timezone / 3600
            });
        }
        
        function getWeatherIconClass(iconCode) {
            const icons = {
                '01d': 'fas fa-sun',
                '01n': 'fas fa-moon',
                '02d': 'fas fa-cloud-sun',
                '02n': 'fas fa-cloud-moon',
                '03d': 'fas fa-cloud',
                '03n': 'fas fa-cloud',
                '04d': 'fas fa-cloud',
                '04n': 'fas fa-cloud',
                '09d': 'fas fa-cloud-showers-heavy',
                '09n': 'fas fa-cloud-showers-heavy',
                '10d': 'fas fa-cloud-sun-rain',
                '10n': 'fas fa-cloud-moon-rain',
                '11d': 'fas fa-bolt',
                '11n': 'fas fa-bolt',
                '13d': 'fas fa-snowflake',
                '13n': 'fas fa-snowflake',
                '50d': 'fas fa-smog',
                '50n': 'fas fa-smog'
            };
            
            return icons[iconCode] || 'fas fa-cloud';
        }
        
        function formatHour(timestamp, timezone) {
            const date = new Date((timestamp + timezone) * 1000);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
        
        function getAQIDescription(aqi) {
            const descriptions = [
                { value: 0, label: "Tidak ada data", class: "" },
                { value: 1, label: "Baik", class: "aqi-good" },
                { value: 2, label: "Sedang", class: "aqi-moderate" },
                { value: 3, label: "Tidak Sehat untuk Kelompok Sensitif", class: "aqi-unhealthy-sensitive" },
                { value: 4, label: "Tidak Sehat", class: "aqi-unhealthy" },
                { value: 5, label: "Sangat Tidak Sehat", class: "aqi-very-unhealthy" },
                { value: 6, label: "Berbahaya", class: "aqi-hazardous" }
            ];
            
            if (aqi === undefined || aqi === null) return descriptions[0];
            return descriptions[aqi] || descriptions[0];
        }
        
        function getUVIndexDescription(uv) {
            if (uv <= 2) return "Rendah";
            if (uv <= 5) return "Sedang";
            if (uv <= 7) return "Tinggi";
            if (uv <= 10) return "Sangat Tinggi";
            return "Ekstrim";
        }
        
        // Recent Searches
        function loadRecentSearches() {
            const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            if (searches.length > 0) {
                recentSearches.classList.remove('hidden');
                recentSearchesList.innerHTML = '';
                
                searches.slice(0, 5).forEach(search => {
                    const searchItem = document.createElement('button');
                    searchItem.className = 'px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm';
                    searchItem.textContent = search;
                    searchItem.addEventListener('click', () => {
                        cityInput.value = search;
                        getWeatherByCity(search);
                    });
                    recentSearchesList.appendChild(searchItem);
                });
            }
        }
        
        function addRecentSearch(city) {
            let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            // Remove if exists already
            searches = searches.filter(search => search.toLowerCase() !== city.toLowerCase());
            // Add to beginning
            searches.unshift(city);
            // Keep only 5 most recent
            searches = searches.slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(searches));
            loadRecentSearches();
        }
        
        // Share functionality
        shareBtn.addEventListener('click', async () => {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'JakCuaca - Info Cuaca',
                        text: `Cek info cuaca terkini dengan JakCuaca!`,
                        url: window.location.href
                    });
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = window.location.href;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    alert('URL disalin ke clipboard!');
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        });
        
        // API Functions
        async function getWeatherByCity(city) {
            try {
                showLoading();
                const weatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}&lang=id`);
                
                if (!weatherResponse.ok) {
                    if (weatherResponse.status === 404) {
                        showError('Wah, kota yang lo cari gak ketemu nih. Coba cek typo atau cari kota lain ya!');
                    } else {
                        showError('Ada masalah nih, coba lagi nanti ya!');
                    }
                    return;
                }
                
                const weatherData = await weatherResponse.json();
                addRecentSearch(weatherData.name);
                await displayWeather(weatherData);
                
            } catch (error) {
                showError('Duh, error nih! Coba refresh atau cek koneksi lo ya.');
                console.error(error);
            }
        }
        
        async function getWeatherByCoords(lat, lon) {
            try {
                showLoading();
                const weatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=id`);
                
                if (!weatherResponse.ok) {
                    showError('Ada masalah nih, coba lagi nanti ya!');
                    return;
                }
                
                const weatherData = await weatherResponse.json();
                addRecentSearch(weatherData.name);
                await displayWeather(weatherData);
                
            } catch (error) {
                showError('Duh, error nih! Coba refresh atau cek koneksi lo ya.');
                console.error(error);
            }
        }
        
        async function getForecast(lat, lon) {
            try {
                const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${API_KEY}&lang=id`);
                
                if (!forecastResponse.ok) {
                    return null;
                }
                
                return await forecastResponse.json();
                
            } catch (error) {
                console.error(error);
                return null;
            }
        }
        
        async function getAirQuality(lat, lon) {
            try {
                const aqiResponse = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                
                if (!aqiResponse.ok) {
                    return null;
                }
                
                return await aqiResponse.json();
                
            } catch (error) {
                console.error(error);
                return null;
            }
        }
        
        async function getUVIndex(lat, lon) {
            try {
                const uvResponse = await fetch(`${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                
                if (!uvResponse.ok) {
                    return null;
                }
                
                return await uvResponse.json();
                
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        async function getWeatherAlerts(lat, lon) {
            try {
                const alertsResponse = await fetch(`${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}`);
                
                if (!alertsResponse.ok) {
                    return null;
                }
                
                const data = await alertsResponse.json();
                return data.alerts || [];
                
            } catch (error) {
                console.error(error);
                return [];
            }
        }

        // Display Functions
        async function displayWeather(weatherData) {
            try {
                const { coord, main, weather, wind, sys, timezone, name, visibility: vis, dt } = weatherData;
                const { lat, lon } = coord;
                
                // Display current weather
                cityName.textContent = name;
                countryCode.textContent = sys.country;
                dateTime.textContent = formatDate(dt, timezone);
                temperature.textContent = Math.round(main.temp);
                weatherDescription.textContent = weather[0].description;
                weatherIcon.className = getWeatherIconClass(weather[0].icon);
                feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
                humidity.textContent = `${main.humidity}%`;
                windSpeed.textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
                pressure.textContent = `${main.pressure} hPa`;
                
                // Sun information
                sunrise.textContent = formatTime(sys.sunrise, timezone);
                sunset.textContent = formatTime(sys.sunset, timezone);
                
                // Additional information
                visibility.textContent = `${(vis / 1000).toFixed(1)} km`;
                
                // Get and display forecasts
                const forecastData = await getForecast(lat, lon);
                if (forecastData) {
                    displayHourlyForecast(forecastData, timezone);
                    displayWeeklyForecast(forecastData, timezone);
                }
                
                // Get and display air quality
                const airQualityData = await getAirQuality(lat, lon);
                if (airQualityData && airQualityData.list && airQualityData.list.length > 0) {
                    displayAirQuality(airQualityData.list[0]);
                } else {
                    // No AQI data available
                    aqiValue.textContent = "Tidak Ada Data";
                    aqiDescription.textContent = "Data kualitas udara tidak tersedia";
                    aqiIcon.className = "fas fa-lungs text-gray-400";
                    aqiBar.style.width = "0%";
                    aqiBar.className = "h-2.5 rounded-full bg-gray-400";
                }
                
                // Get and display UV Index
                try {
                    const uvData = await getUVIndex(lat, lon);
                    if (uvData) {
                        const uvVal = Math.round(uvData.value);
                        uvIndex.textContent = `${uvVal} (${getUVIndexDescription(uvVal)})`;
                    } else {
                        uvIndex.textContent = "Tidak Ada Data";
                    }
                } catch (error) {
                    uvIndex.textContent = "Tidak Ada Data";
                }
                
                // Check for weather alerts
                const alerts = await getWeatherAlerts(lat, lon);
                if (alerts && alerts.length > 0) {
                    weatherAlerts.classList.remove('hidden');
                    alertTitle.textContent = alerts[0].event || "Peringatan Cuaca";
                    alertDescription.textContent = alerts[0].description || "Ada peringatan cuaca di daerah ini.";
                } else {
                    weatherAlerts.classList.add('hidden');
                }
                
                showWeatherInfo();
                
            } catch (error) {
                showError('Duh, error nih pas nampilin data. Coba refresh halaman ya!');
                console.error(error);
            }
        }

        function displayHourlyForecast(forecastData, timezone) {
            hourlyForecast.innerHTML = '';
            
            // Display next 8 hours only
            forecastData.list.slice(0, 8).forEach(item => {
                const hourlyItem = document.createElement('div');
                hourlyItem.className = 'p-3 bg-white/5 rounded-lg text-center min-w-[80px]';
                
                const hourlyTime = document.createElement('p');
                hourlyTime.className = 'text-gray-300 text-sm';
                hourlyTime.textContent = formatHour(item.dt, timezone);
                
                const hourlyIcon = document.createElement('div');
                hourlyIcon.className = `${getWeatherIconClass(item.weather[0].icon)} text-xl text-blue-500 my-2`;
                
                const hourlyTemp = document.createElement('p');
                hourlyTemp.className = 'text-white font-bold';
                hourlyTemp.textContent = `${Math.round(item.main.temp)}°C`;
                
                hourlyItem.appendChild(hourlyTime);
                hourlyItem.appendChild(hourlyIcon);
                hourlyItem.appendChild(hourlyTemp);
                hourlyForecast.appendChild(hourlyItem);
            });
        }

        function displayWeeklyForecast(forecastData, timezone) {
            weeklyForecast.innerHTML = '';
            
            // Group forecasts by day
            const dailyForecasts = {};
            
            forecastData.list.forEach(item => {
                const date = new Date((item.dt + timezone) * 1000);
                const day = date.toISOString().split('T')[0];
                
                if (!dailyForecasts[day]) {
                    dailyForecasts[day] = {
                        temps: [],
                        icons: [],
                        date: item.dt
                    };
                }
                
                dailyForecasts[day].temps.push(item.main.temp);
                dailyForecasts[day].icons.push(item.weather[0].icon);
            });
            
            // Get most frequent icon for each day
            Object.keys(dailyForecasts).slice(0, 5).forEach(day => {
                const forecast = dailyForecasts[day];
                const iconCounts = {};
                
                forecast.icons.forEach(icon => {
                    iconCounts[icon] = (iconCounts[icon] || 0) + 1;
                });
                
                let mostFrequentIcon = '';
                let maxCount = 0;
                
                Object.keys(iconCounts).forEach(icon => {
                    if (iconCounts[icon] > maxCount) {
                        mostFrequentIcon = icon;
                        maxCount = iconCounts[icon];
                    }
                });
                
                // Calculate min and max temperatures
                const minTemp = Math.min(...forecast.temps);
                const maxTemp = Math.max(...forecast.temps);
                
                // Create daily forecast card
                const dayCard = document.createElement('div');
                dayCard.className = 'p-4 bg-white/5 rounded-lg text-center';
                
                const dayName = document.createElement('p');
                dayName.className = 'text-gray-300';
                dayName.textContent = formatDay(forecast.date, timezone);
                
                const dayIcon = document.createElement('div');
                dayIcon.className = `${getWeatherIconClass(mostFrequentIcon)} text-2xl text-blue-500 my-3`;
                
                const tempRange = document.createElement('p');
                tempRange.className = 'text-white font-semibold';
                tempRange.textContent = `${Math.round(minTemp)}° - ${Math.round(maxTemp)}°`;
                
                dayCard.appendChild(dayName);
                dayCard.appendChild(dayIcon);
                dayCard.appendChild(tempRange);
                weeklyForecast.appendChild(dayCard);
            });
    }

    function displayAirQuality(airData) {
        const aqi = airData.main.aqi;
        const aqiInfo = getAQIDescription(aqi);
        
        aqiValue.textContent = aqi;
        aqiDescription.textContent = aqiInfo.label;
        aqiIcon.className = `fas fa-lungs ${aqiInfo.class}`;
        
        // Update AQI bar
        aqiBar.style.width = `${(aqi / 5) * 100}%`;
        
        // Set AQI bar color based on level
        if (aqi === 1) aqiBar.className = "h-2.5 rounded-full bg-green-500";
        else if (aqi === 2) aqiBar.className = "h-2.5 rounded-full bg-yellow-500";
        else if (aqi === 3) aqiBar.className = "h-2.5 rounded-full bg-orange-500";
        else if (aqi === 4) aqiBar.className = "h-2.5 rounded-full bg-red-500";
        else if (aqi === 5) aqiBar.className = "h-2.5 rounded-full bg-purple-500";
        else aqiBar.className = "h-2.5 rounded-full bg-gray-500";
    }

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        } else {
            showError('Masukkan nama kota dulu dong!');
        }
    });

    cityInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeatherByCity(city);
            } else {
                showError('Masukkan nama kota dulu dong!');
            }
        }
    });

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    hideLoading();
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            showError('Please allow location access to use this feature');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            showError('Lokasi lo gak bisa dideteksi nih');
                            break;
                        case error.TIMEOUT:
                            showError('Request timeout. Coba lagi ya!');
                            break;
                        default:
                            showError('Ada error pas dapetin lokasi lo');
                    }
                }
            );
        } else {
            showError('Browser lo gak support geolocation nih');
        }
    });

    welcomeLocationBtn.addEventListener('click', () => {
        locationBtn.click();
    });

    welcomeSearchBtn.addEventListener('click', () => {
        welcomeMessage.classList.add('hidden');
        cityInput.focus();
    });

    // Initialize
    function init() {
        loadRecentSearches();
        
        // Check URL parameters for city
        const urlParams = new URLSearchParams(window.location.search);
        const cityParam = urlParams.get('city');
        
        if (cityParam) {
            cityInput.value = cityParam;
            getWeatherByCity(cityParam);
        }
        
        // Add a fun Easter egg
        console.log("%c🌤️ JakCuaca - Cuaca Kekinian", "font-size: 24px; font-weight: bold; color: #3b82f6;");
        console.log("%cDikembangkan oleh Aditya Fakhri Riansyah untuk RamadhanJS Challenge 2025", "font-size: 14px;");
    }

    init();