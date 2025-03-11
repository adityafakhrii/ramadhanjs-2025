// API key untuk OpenWeatherMap (Daftar dulu ya di openweathermap.org untuk dapat API key)
const API_KEY = 'ac9827e70b4fe472dbc20ce49bc81b9d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const darkModeToggle = document.getElementById('darkMode');

// Dark Mode Handler
if (localStorage.getItem('darkMode') === 'enabled') {
  document.documentElement.classList.add('dark');
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Weather Functions
async function getWeatherByCity(city) {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=id`);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    alert('Waduh, kota tidak ketemu nih! Coba cek lagi ya penulisannya 😅');
  }
}

async function getWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`);
    if (!response.ok) {
      throw new Error('Location error');
    }
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    alert('Ups, ada yang salah nih! Coba refresh ya 😅');
  }
}

function updateWeatherUI(data) {
  // Update location and basic info
  document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('description').textContent = capitalizeFirstLetter(data.weather[0].description);
  
  // Update additional info
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
  
  // UV Index calculation
  const uvIndex = calculateUVIndex(data.weather[0].id, data.dt, data.sys.sunrise, data.sys.sunset);
  document.getElementById('uvIndex').textContent = uvIndex;
  
  // Update weather icon - using 4x size for better quality
  const iconCode = data.weather[0].icon;
  const weatherIcon = document.getElementById('weatherIcon');
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  weatherIcon.alt = data.weather[0].description;
}

function calculateUVIndex(weatherId, currentTime, sunrise, sunset) {
  if (currentTime < sunrise || currentTime > sunset) return 0;
  if (weatherId >= 800) return 8;
  if (weatherId >= 700) return 5;
  return 2;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) getWeatherByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) getWeatherByCity(city);
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert('Ups, izin lokasi ditolak nih! Coba izinkan dulu ya 😊');
      }
    );
  } else {
    alert('Browser kamu ngga support geolocation nih 😅');
  }
});

// Initial weather check for Jakarta
getWeatherByCity('Jakarta');