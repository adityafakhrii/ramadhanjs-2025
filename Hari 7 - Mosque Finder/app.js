let map;
let markers = [];
let userMarker;
let userLocation = { lat: 0, lng: 0 };
let isDarkMode = false;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                document.getElementById('currentLocation').textContent = 'Your Current Location';
                
                // Load prayer times
                fetchPrayerTimes(userLocation.lat, userLocation.lng);
                
                // Initialize map after we have location
                initMap();
            },
            error => {
                console.error("Error getting location:", error);
                document.getElementById('currentLocation').textContent = 'Location access denied';
                
                // Use a default location (Jakarta, Indonesia)
                userLocation = { lat: -6.2088, lng: 106.8456 };
                
                // Initialize map with default location
                initMap();
            }
        );
    } else {
        document.getElementById('currentLocation').textContent = 'Geolocation not supported';
        
        // Use a default location
        userLocation = { lat: -6.2088, lng: 106.8456 };
        
        // Initialize map with default location
        initMap();
    }
    
    // Set up event listeners
    document.getElementById('findNearbyButton').addEventListener('click', findNearbyMosques);
    document.getElementById('searchLocation').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });
    
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleDarkMode();
    }
});

<<<<<<< HEAD
// // Initialize Google Maps
// function initMap() {
//     // Load Google Maps API script
//     const googleMapsScript = document.createElement('script');
//     googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAyA2PuYyUQVLZgkjYmSRcLUCbi0RAac-Y&libraries=places`;
//     googleMapsScript.defer = true;
//     googleMapsScript.async = true;
//     googleMapsScript.onload = initializeMap;
//     document.head.appendChild(googleMapsScript);
// }

=======
>>>>>>> eaf08887c91400f19c0653215447385042e51b94
function initMap() {
    const googleMapsScript = document.createElement('script');
    fetch('api-key.json')
        .then(response => response.json())
        .then(data => {
            googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places,marker,geometry&callback=initializeMap&loading=async&v=beta&map_ids=63211094599e0fec`;
            document.head.appendChild(googleMapsScript);
        })
        .catch(error => console.error('Error loading API key:', error));
    document.head.appendChild(googleMapsScript);
}

function initializeMap() {
    // Membuat map
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 14,
        styles: isDarkMode ? darkMapStyle : lightMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapId: '63211094599e0fec' // Tambahkan map ID untuk fitur baru
    });

    // Membuat marker user dengan AdvancedMarkerElement
    userMarker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: userLocation,
        content: createUserMarkerContent(),
        title: 'Lokasi Anda'
    });
}

function createUserMarkerContent() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div style="position: relative">
            <div style="
                width: 20px;
                height: 20px;
                background: #4299E1;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            "></div>
            <div style="
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                font-size: 12px;
                padding: 2px 6px;
                background: white;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
                Your Location
            </div>
        </div>
    `;
    return container;
}

function showLoadingState() {
    document.getElementById('mosquesList').innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mosque-card transition-all duration-300 animate-pulse">
            <div class="h-40 bg-gray-200 dark:bg-gray-700"></div>
            <div class="p-4">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
        <!-- Tambahkan 2 placeholder lagi -->
        ${Array(2).fill().map(() => `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mosque-card transition-all duration-300 animate-pulse">
            <div class="h-40 bg-gray-200 dark:bg-gray-700"></div>
            <div class="p-4">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
        `).join('')}
    `;
}

// Find nearby mosques using Google Places API
async function findNearbyMosques() {
    try {
        if (!map) return;

        // Tampilkan loading state
        showLoadingState();

        const service = new google.maps.places.PlacesService(map);
        
        // Parameter pencarian yang lebih akurat
        const request = {
            location: userLocation,
            radius: 10000, // Perbesar radius
            type: 'mosque', // Gunakan tipe spesifik
            keyword: 'masjid mosque musala langgar',
            language: 'id'
        };

        const results = await new Promise((resolve, reject) => {
            service.nearbySearch(request, (results, status) => {
                status === google.maps.places.PlacesServiceStatus.OK 
                    ? resolve(results) 
                    : reject(status);
            });
        });

        // Filter lebih longgar
        const mosques = results.filter(place => 
            place.types.includes('mosque') ||
            place.name.toLowerCase().includes('masjid') ||
            place.name.toLowerCase().includes('mushola')
        );

        if (mosques.length === 0) {
            showNoResultsMessage();
            return;
        }

        // Tampilkan hasil
        displayMosques(mosques);

    } catch (error) {
        console.error('Error:', error);
        handlePlacesError(error);
    }
}

function displayMosques(mosques) {
    clearMarkers();
    document.getElementById('mosquesList').innerHTML = '';
    
    mosques.slice(0, 9).forEach(place => {
        createMarker(place);
        addMosqueCard(place);
    });
}

// Process search results
function processResults(results) {
    // Filter hasil untuk memastikan hanya masjid
    const mosques = results.filter(place => 
        place.name.toLowerCase().includes('masjid') || 
        place.name.toLowerCase().includes('mosque')
    );

    // Tampilkan hasil atau pesan kosong
    if (mosques.length > 0) {
        mosques.forEach((place, index) => {
            if (index < 9) {
                createMarker(place);
                addMosqueCard(place);
            }
        });
    } else {
        showNoResultsMessage();
    }
}

function showNoResultsMessage() {
    document.getElementById('mosquesList').innerHTML = `
        <div class="col-span-full text-center p-6 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Tidak ada mesjid terdekat yang ditemukan</h3>
            <p class="text-yellow-700 dark:text-yellow-300 mt-2">Coba cari di area yang lebih luas atau gunakan kata kunci berbeda</p>
        </div>
    `;
}

function handlePlacesError(status) {
    console.log('Detail error:', {
        status,
        location: userLocation,
        timestamp: new Date().toISOString()
    });
    let errorMessage = 'Error mencari masjid';
    
    switch(status) {
        case 'ZERO_RESULTS':
            errorMessage = 'Tidak ditemukan masjid di area ini';
            break;
        case 'OVER_QUERY_LIMIT':
            errorMessage = 'Kuota API terlampaui';
            break;
        case 'REQUEST_DENIED':
            errorMessage = 'Akses API ditolak. Cek API Key';
            break;
    }
    
    document.getElementById('mosquesList').innerHTML = `
        <div class="col-span-full text-center p-6 bg-red-50 dark:bg-red-900 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-lg font-semibold text-red-700 dark:text-red-300">${errorMessage}</h3>
        </div>
    `;
}

// Create a marker for a place
function createMarker(place) {
    // Membuat konten marker baru
    const markerContent = document.createElement('div');
    markerContent.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0D9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 22h16"></path>
            <path d="M12 2v7"></path>
            <path d="M12 13v3"></path>
            <path d="M12 17v2"></path>
            <path d="M4.91 7.5C3.66 9.35 3 11.48 3 13.8 3 18.09 6.91 22 12 22s9-3.91 9-8.2c0-2.32-.66-4.45-1.91-6.3"></path>
            <path d="M9 10h6"></path>
        </svg>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.geometry.location,
        content: markerContent,
        title: place.name
    });

    markers.push(marker);
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="info-window">
                <h3 class="font-semibold">${place.name}</h3>
                <p class="text-sm">${place.vicinity || ''}</p>
                <div class="mt-2">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank" class="text-sm text-blue-600 hover:text-blue-800">Get Directions</a>
                </div>
            </div>
        `
    });
    
    marker.addEventListener('gmp-click', () => {
        infoWindow.open(map, marker);
    });
}

// Add mosque card to the list
function addMosqueCard(place) {
    
    if(!google.maps.geometry) {
        console.error('Geometry library not loaded');
        return;
    }
    
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLocation.lat, userLocation.lng),
        new google.maps.LatLng(
            place.geometry.location.lat(), 
            place.geometry.location.lng()
        )
    );
    
    const formattedDistance = distance < 1000 ? 
        `${Math.round(distance)} m` : 
        `${(distance / 1000).toFixed(1)} km`;
    
    const rating = place.rating ? `
        <div class="flex items-center mb-1">
            <span class="text-yellow-500 mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </span>
            <span class="text-sm font-medium">${place.rating}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">(${place.user_ratings_total || 0})</span>
        </div>
    ` : '';
    
    const photoUrl = place.photos && place.photos.length > 0 ? 
        place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) : 
        '/api/placeholder/400/300';
    
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mosque-card transition-all duration-300';
    card.innerHTML = `
        <div class="h-40 bg-cover bg-center" style="background-image: url('${photoUrl}')">
            <div class="p-3 bg-gradient-to-t from-black to-transparent flex items-end h-full">
                <div class="px-2 py-1 rounded-full bg-teal-600 text-white text-xs font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    ${formattedDistance}
                </div>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-semibold text-gray-800 dark:text-white mb-1">${place.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                ${place.vicinity || 'No address available'}
            </p>
            ${rating}
            <div class="mt-3 flex justify-between items-center">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank" class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                    </svg>
                    Directions
                </a>
                <button class="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400" onclick="focusOnMarker(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('mosquesList').appendChild(card);
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Focus on a specific marker
function focusOnMarker(lat, lng) {
    map.setCenter({ lat, lng });
    map.setZoom(16);
    
    // Find and animate the marker
    const position = new google.maps.LatLng(lat, lng);
    markers.forEach(marker => {
        if (marker.getPosition().equals(position)) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                marker.setAnimation(null);
            }, 1500);
            
            // Trigger the click event to show info window
            google.maps.event.trigger(marker, 'click');
        }
    });
}

// Search for a location by address
function searchLocation() {
    const address = document.getElementById('searchLocation').value;
    if (!address) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            userLocation = {
                lat: location.lat(),
                lng: location.lng()
            };

            // Update posisi marker yang benar untuk AdvancedMarkerElement
            if(userMarker) {
                userMarker.position = { 
                    lat: userLocation.lat, 
                    lng: userLocation.lng 
                };
                userMarker.map = map;
            }

            // Update tampilan peta
            map.setCenter(userLocation);
            
            // Perbarui pencarian mesjid
            fetchPrayerTimes(userLocation.lat, userLocation.lng);
            findNearbyMosques();
        }
    });
}

// Fetch prayer times from API
function fetchPrayerTimes(lat, lng) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=2`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                const day = today.getDate();
                const timings = data.data[day - 1].timings;
                
                // Update prayer time displays
                document.getElementById('fajrTime').textContent = formatTime(timings.Fajr);
                document.getElementById('dhuhrTime').textContent = formatTime(timings.Dhuhr);
                document.getElementById('asrTime').textContent = formatTime(timings.Asr);
                document.getElementById('maghribTime').textContent = formatTime(timings.Maghrib);
                document.getElementById('ishaTime').textContent = formatTime(timings.Isha);
                
                // Calculate next prayer
                updateNextPrayer(timings);
            }
        })
        .catch(error => {
            console.error("Error fetching prayer times:", error);
            document.getElementById('fajrTime').textContent = '--:--';
            document.getElementById('dhuhrTime').textContent = '--:--';
            document.getElementById('asrTime').textContent = '--:--';
            document.getElementById('maghribTime').textContent = '--:--';
            document.getElementById('ishaTime').textContent = '--:--';
            document.getElementById('nextPrayer').textContent = 'Prayer times unavailable';
        });
}

// Format prayer time to 12-hour format
function formatTime(timeString) {
    // Remove "(+03)" or similar timezone indicators
    const time = timeString.split(' ')[0];
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
}

// Calculate and update next prayer time
function updateNextPrayer(timings) {
    const prayers = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
    ];
    
    const now = new Date();
    let nextPrayer = null;
    let timeUntilNext = Infinity;
    
    prayers.forEach(prayer => {
        const prayerTime = getPrayerDate(prayer.time);
        const diff = prayerTime - now;
        
        if (diff > 0 && diff < timeUntilNext) {
            nextPrayer = prayer;
            timeUntilNext = diff;
        }
    });
    
    if (nextPrayer) {
        const hours = Math.floor(timeUntilNext / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeText;
        if (hours > 0) {
            timeText = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            timeText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        
        document.getElementById('nextPrayer').innerHTML = `
            Next Prayer: <span class="font-bold">${nextPrayer.name}</span> in <span class="font-bold">${timeText}</span>
        `;
    } else {
        // If we've passed Isha, the next prayer is tomorrow's Fajr
        document.getElementById('nextPrayer').textContent = 'Next Prayer: Fajr tomorrow';
    }
}

// Convert prayer time string to Date object
function getPrayerDate(timeString) {
    const time = timeString.split(' ')[0]; // Remove "(+03)" or similar
    const [hours, minutes] = time.split(':');
    
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    
    return date;
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    // Update body classes
    document.body.classList.toggle('dark-islamic-pattern');
    document.body.classList.toggle('bg-gray-900');
    document.body.classList.toggle('text-gray-100');
    
    document.body.classList.toggle('islamic-pattern');
    document.body.classList.toggle('bg-gray-50');
    document.body.classList.toggle('text-gray-800');
    
    // Update UI elements
    document.getElementById('darkModeIcon').classList.toggle('hidden');
    document.getElementById('lightModeIcon').classList.toggle('hidden');
    
    // Update map style if map exists
    if (map) {
        map.setOptions({
            styles: isDarkMode ? darkMapStyle : lightMapStyle
        });
    }
}

// Map styles for light mode
const lightMapStyle = [
    {
        "featureType": "poi.business",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [{ "visibility": "off" }]
    }
];

// Map styles for dark mode
const darkMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#263c3f" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b9a76" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#212a37" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9ca5b3" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#1f2835" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#f3d19c" }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#2f3948" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#515c6d" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#17263c" }]
    },
    {
        "featureType": "poi.business",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [{ "visibility": "off" }]
    }
];