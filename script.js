// Configuration
const CONFIG = {
    WEATHER_API_KEY: 'b1ed402df4814dc2b3f180428243110', // Replace with your WeatherAPI.com key
};

// Original HTML template for the cards container
const CARDS_TEMPLATE = `
    <!-- Time Card -->
    <div class="card time-card">
        <div class="time-content">
            <h2 id="locationName" class="location-title"></h2>
            <div class="time-display">
                <div class="clock" id="clock"></div>
                <div class="date" id="date"></div>
            </div>
        </div>
    </div>

    <!-- Weather Card -->
    <div class="card weather-card">
        <div class="weather-main">
            <img id="weatherIcon" class="weather-icon" src="" alt="Weather">
            <div class="temperature">
                <span id="temperature"></span>
                <span class="temp-unit">°C</span>
            </div>
            <div id="weather" class="weather-condition"></div>
        </div>
        <div class="weather-details">
            <div class="weather-detail-item">
                <i class="fas fa-droplet-degree"></i>
                <div class="detail-info">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value" id="humidity">--</span>
                </div>
            </div>
            <div class="weather-detail-item">
                <i class="fas fa-wind"></i>
                <div class="detail-info">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value" id="windSpeed">--</span>
                </div>
            </div>
        </div>
    </div>

    <!-- History Card -->
    <div class="card history-card">
        <div class="history-header" onclick="toggleHistoryOverview(event)">
            <h3 class="history-title">
                <i class="fas fa-book-open"></i>
                Location Overview
            </h3>
            <i class="fas fa-chevron-down expand-icon"></i>
        </div>
        <div class="history-content" id="historyContent">
            <div class="history-loading">
                <div class="spinner"></div>
                <p>Loading overview...</p>
            </div>
            <div class="history-text"></div>
            <a href="#" class="wiki-link" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-wikipedia-w"></i>
                Read more on Wikipedia
            </a>
        </div>
    </div>

    <!-- Sun Card -->
    <div class="card sun-card">
        <h3 class="sun-title">
            <i class="fas fa-sun"></i>
            Daylight Hours
        </h3>
        <div class="sun-info">
            <div class="sun-event">
                <i class="fas fa-sun fa-bounce"></i>
                <div class="sun-details">
                    <span class="sun-label">Sunrise</span>
                    <span class="sun-time" id="sunrise">--:--</span>
                </div>
            </div>
            <div class="sun-event">
                <i class="fas fa-moon fa-bounce"></i>
                <div class="sun-details">
                    <span class="sun-label">Sunset</span>
                    <span class="sun-time" id="sunset">--:--</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Map Card -->
    <div class="card map-card">
        <div id="map" class="map-container"></div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <p>
            © 2024 <span class="brand">A Bowcode Site</span>
            <span>•</span>
            <span class="version">Version 2.0</span>
        </p>
    </footer>
`;

// Add these validation functions
const VALIDATORS = {
    location: (input) => {
        // Allow letters, numbers, spaces, commas, and basic punctuation
        return /^[a-zA-Z0-9\s,.-]+$/.test(input);
    },
    state: (input) => {
        // List of valid US states
        const validStates = [
            'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
            'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
            'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
            'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
            'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
            'new hampshire', 'new jersey', 'new mexico', 'new york',
            'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
            'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
            'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
            'west virginia', 'wisconsin', 'wyoming'
        ];
        return validStates.includes(input.toLowerCase());
    },
    country: (input) => {
        // Basic country name validation (letters, spaces, and basic punctuation)
        return /^[a-zA-Z\s,.-]+$/.test(input) && input.length >= 2;
    }
};

// Add these formatting functions
const FORMATTERS = {
    location: (input) => {
        // Capitalize first letter of each word
        return input.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },
    state: (input) => {
        // Format state name
        const formatted = input.trim().toLowerCase();
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    },
    country: (input) => {
        // Format country name
        return input.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
};

// Add this constant for state capitals
const STATE_CAPITALS = {
    'alabama': 'Montgomery',
    'alaska': 'Juneau',
    'arizona': 'Phoenix',
    'arkansas': 'Little Rock',
    'california': 'Sacramento',
    'colorado': 'Denver',
    'connecticut': 'Hartford',
    'delaware': 'Dover',
    'florida': 'Tallahassee',
    'georgia': 'Atlanta',
    'hawaii': 'Honolulu',
    'idaho': 'Boise',
    'illinois': 'Springfield',
    'indiana': 'Indianapolis',
    'iowa': 'Des Moines',
    'kansas': 'Topeka',
    'kentucky': 'Frankfort',
    'louisiana': 'Baton Rouge',
    'maine': 'Augusta',
    'maryland': 'Annapolis',
    'massachusetts': 'Boston',
    'michigan': 'Lansing',
    'minnesota': 'St. Paul',
    'mississippi': 'Jackson',
    'missouri': 'Jefferson City',
    'montana': 'Helena',
    'nebraska': 'Lincoln',
    'nevada': 'Carson City',
    'new hampshire': 'Concord',
    'new jersey': 'Trenton',
    'new mexico': 'Santa Fe',
    'new york': 'Albany',
    'north carolina': 'Raleigh',
    'north dakota': 'Bismarck',
    'ohio': 'Columbus',
    'oklahoma': 'Oklahoma City',
    'oregon': 'Salem',
    'pennsylvania': 'Harrisburg',
    'rhode island': 'Providence',
    'south carolina': 'Columbia',
    'south dakota': 'Pierre',
    'tennessee': 'Nashville',
    'texas': 'Austin',
    'utah': 'Salt Lake City',
    'vermont': 'Montpelier',
    'virginia': 'Richmond',
    'washington': 'Olympia',
    'west virginia': 'Charleston',
    'wisconsin': 'Madison',
    'wyoming': 'Cheyenne'
};

// Add these map-related constants at the top with other constants
const MAP_CONFIG = {
    defaultZoom: 12,
    minZoom: 3,
    maxZoom: 18,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
};

// Add this variable at the top with other globals
let isFahrenheit = false;
let is24Hour = false;

// Add these constants for theme management
const HOLIDAY_THEMES = {
    christmas: {
        startMonth: 11, // November
        endMonth: 0,   // January
        icon: '🎄'
    },
    halloween: {
        startMonth: 9,  // October
        endMonth: 9,
        icon: '🎃'
    },
    july4th: {
        startMonth: 6,  // July
        endMonth: 6,
        icon: '🎆'
    }
};

// Add this function to check if a holiday theme is in season
function isThemeInSeason(themeName) {
    const theme = HOLIDAY_THEMES[themeName];
    if (!theme) return true; // Regular themes are always in season
    
    const currentMonth = new Date().getMonth();
    
    if (theme.startMonth <= theme.endMonth) {
        return currentMonth >= theme.startMonth && currentMonth <= theme.endMonth;
    } else {
        // Handle cases like Christmas (November to January)
        return currentMonth >= theme.startMonth || currentMonth <= theme.endMonth;
    }
}

// Weather API Integration
async function searchLocation() {
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    const locationInput = document.getElementById('locationInput').value.trim();
    
    if (!locationInput) {
        showError('Please enter a location');
        return;
    }

    // Validate input
    if (!VALIDATORS[searchType](locationInput)) {
        switch(searchType) {
            case 'state':
                showError('Please enter a valid US state name');
                break;
            case 'country':
                showError('Please enter a valid country name');
                break;
            default:
                showError('Please enter a valid location name');
                break;
        }
        return;
    }

    // Format input
    const formattedInput = FORMATTERS[searchType](locationInput);
    let searchQuery = formattedInput;
    
    // Build search query
    switch(searchType) {
        case 'state':
            const stateCapital = STATE_CAPITALS[formattedInput.toLowerCase()];
            searchQuery = `${stateCapital}, ${formattedInput}, United States`;
            break;
        case 'country':
            searchQuery = `${formattedInput}`;
            break;
    }

    const cardsContainer = document.querySelector('.cards-container');
    const errorContainer = document.getElementById('errorContainer');

    try {
        showLoading();
        errorContainer.style.display = 'none';

        // Test the query first
        const testUrl = `https://api.weatherapi.com/v1/search.json?key=${CONFIG.WEATHER_API_KEY}&q=${encodeURIComponent(searchQuery)}`;
        const testResponse = await fetch(testUrl);
        const testData = await testResponse.json();

        if (!testData.length) {
            throw new Error('Location not found. Please try a different search.');
        }

        // Use the first (most relevant) result
        const bestMatch = testData[0];
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${CONFIG.WEATHER_API_KEY}&q=${encodeURIComponent(bestMatch.url)}&days=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        restoreCardsTemplate();
        updateWeatherUI(data);
        initMap(data.location.lat, data.location.lon, data.location.name);
        cardsContainer.style.display = 'grid';
        
    } catch (error) {
        showError(error.message || 'Unable to fetch weather data');
    } finally {
        hideLoading();
    }
}

// Restore original cards template
function restoreCardsTemplate() {
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = CARDS_TEMPLATE;
}

// UI Updates
function updateWeatherUI(data) {
    // Update location name with a cleaner format
    const locationName = document.getElementById('locationName');
    if (locationName) {
        // Check if this is a state search by looking at the search type
        const searchType = document.querySelector('input[name="searchType"]:checked').value;
        if (searchType === 'state') {
            // Extract state name from the original search query
            const stateName = data.location.region;
            locationName.textContent = `${data.location.name}, ${stateName}`;
        } else {
            locationName.textContent = `${data.location.name}, ${data.location.country}`;
        }
    }

    // Update weather information
    const weatherIcon = document.getElementById('weatherIcon');
    const temperature = document.getElementById('temperature');
    const weather = document.getElementById('weather');
    const feelsLike = document.getElementById('feelsLike');

    if (weatherIcon && temperature && weather) {
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;
        weather.textContent = data.current.condition.text;

        // Store the temperature values
        const tempC = Math.round(data.current.temp_c);
        const feelsLikeC = Math.round(data.current.feelslike_c);

        // Update temperatures based on current unit setting
        if (isFahrenheit) {
            temperature.textContent = Math.round((tempC * 9/5) + 32);
            if (feelsLike) {
                feelsLike.textContent = `${Math.round((feelsLikeC * 9/5) + 32)}°F`;
            }
            document.querySelectorAll('.temp-unit').forEach(el => el.textContent = '°F');
        } else {
            temperature.textContent = tempC;
            if (feelsLike) {
                feelsLike.textContent = `${feelsLikeC}°C`;
            }
            document.querySelectorAll('.temp-unit').forEach(el => el.textContent = '°C');
        }
    }

    // Update additional weather details if they exist
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const windDirection = document.getElementById('windDirection');

    if (humidity) humidity.textContent = `${data.current.humidity}%`;
    if (windSpeed) windSpeed.textContent = `${data.current.wind_kph} km/h`;
    if (windDirection) windDirection.textContent = data.current.wind_dir;

    // Update sunrise and sunset times
    const sunriseElement = document.getElementById('sunrise');
    const sunsetElement = document.getElementById('sunset');
    
    if (sunriseElement && sunsetElement && data.forecast?.forecastday?.[0]?.astro) {
        const astroData = data.forecast.forecastday[0].astro;
        
        // Convert 12-hour format to 24-hour format for consistency
        const formatTime = (timeStr) => {
            if (!timeStr) return '--:--';
            return timeStr.replace(/\s+AM|PM/, '').trim();
        };

        sunriseElement.textContent = formatTime(astroData.sunrise);
        sunsetElement.textContent = formatTime(astroData.sunset);
    }

    // Store the timezone for clock updates
    window.currentTimezone = data.location.tz_id;
    
    // Initialize clock with location's timezone
    updateLocalClock(data.location.tz_id);
}

// Map Integration
let map = null;

function initMap(lat, lon, locationName) {
    if (map) {
        map.remove();
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Create map with improved options
    map = L.map('map', {
        center: [lat, lon],
        zoom: MAP_CONFIG.defaultZoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        tap: true
    });

    // Add tile layer with better styling
    L.tileLayer(MAP_CONFIG.tileLayer, {
        attribution: MAP_CONFIG.attribution,
        className: 'map-tiles'
    }).addTo(map);

    // Add a custom marker with popup
    const marker = L.marker([lat, lon], {
        title: locationName,
        riseOnHover: true
    }).addTo(map);

    // Add a popup with location information
    marker.bindPopup(`
        <div class="map-popup">
            <h3>${locationName}</h3>
            <p>Latitude: ${lat.toFixed(4)}</p>
            <p>Longitude: ${lon.toFixed(4)}</p>
        </div>
    `, {
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        className: 'custom-popup'
    }).openPopup();

    // Add a circle to highlight the area
    L.circle([lat, lon], {
        color: 'var(--accent)',
        fillColor: 'var(--accent)',
        fillOpacity: 0.1,
        radius: 2000,
        weight: 1
    }).addTo(map);

    // Fix the map display issue by triggering a resize
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Loading State
function showLoading() {
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = `
        <div class="card loading-card">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
    cardsContainer.style.display = 'block';
}

function hideLoading() {
    const loadingCard = document.querySelector('.loading-card');
    if (loadingCard) {
        loadingCard.remove();
    }
}

// Error Handling
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorText = document.getElementById('errorText');
    if (errorContainer && errorText) {
        errorText.textContent = message;
        errorContainer.style.display = 'block';
    }
}

// Add Clock Management
function updateLocalClock(timezone) {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    
    if (!clockElement || !dateElement) return;

    function updateTime() {
        const now = new Date();
        
        // Format time based on preference
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !is24Hour,
            timeZone: timezone
        };

        // Format date: Day, Month Date, Year
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: timezone
        };

        try {
            const timeString = now.toLocaleTimeString('en-US', timeOptions);
            clockElement.textContent = timeString;
            dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
        } catch (error) {
            console.error('Error updating clock:', error);
        }
    }

    // Update immediately and then every second
    updateTime();
    if (window.clockInterval) {
        clearInterval(window.clockInterval);
    }
    window.clockInterval = setInterval(updateTime, 1000);
}

// Add debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add these at the top with other global variables
let isDevMode = false;
const DEV_PASSWORD = 'Admin';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    isFahrenheit = localStorage.getItem('tempUnit') === 'F';
    is24Hour = localStorage.getItem('clockFormat') === '24h';
    
    // Initialize UI elements
    const searchInput = document.getElementById('locationInput');
    const unitToggle = document.getElementById('unitToggle');
    const clockToggle = document.getElementById('clockToggle');
    const themeSelect = document.getElementById('themeSelect');
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    // Set initial states
    unitToggle.checked = isFahrenheit;
    clockToggle.checked = is24Hour;

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Settings modal handlers
    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Theme change handler
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Temperature unit toggle handler
    unitToggle.addEventListener('change', (e) => {
        isFahrenheit = e.target.checked;
        localStorage.setItem('tempUnit', isFahrenheit ? 'F' : 'C');
        updateTemperatureDisplay();
    });

    // Clock format toggle handler
    clockToggle.addEventListener('change', (e) => {
        is24Hour = e.target.checked;
        localStorage.setItem('clockFormat', is24Hour ? '24h' : '12h');
        if (window.currentTimezone) {
            updateLocalClock(window.currentTimezone);
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.style.display === 'block') {
            settingsModal.style.display = 'none';
        }
    });
});

// Add this helper function for temperature updates
function updateTemperatureDisplay() {
    const temperatureElement = document.getElementById('temperature');
    const feelsLikeElement = document.getElementById('feelsLike');
    
    if (temperatureElement) {
        const currentTemp = parseInt(temperatureElement.textContent);
        if (!isNaN(currentTemp)) {
            if (isFahrenheit) {
                temperatureElement.textContent = Math.round((currentTemp * 9/5) + 32);
                if (feelsLikeElement) {
                    const feelsLikeTemp = parseInt(feelsLikeElement.textContent);
                    feelsLikeElement.textContent = `${Math.round((feelsLikeTemp * 9/5) + 32)}°F`;
                }
                document.querySelectorAll('.temp-unit').forEach(el => el.textContent = '°F');
            } else {
                temperatureElement.textContent = Math.round((currentTemp - 32) * 5/9);
                if (feelsLikeElement) {
                    const feelsLikeTemp = parseInt(feelsLikeElement.textContent);
                    feelsLikeElement.textContent = `${Math.round((feelsLikeTemp - 32) * 5/9)}°C`;
                }
                document.querySelectorAll('.temp-unit').forEach(el => el.textContent = '°C');
            }
        }
    }
}

// Add this function to handle dev mode features
function enableDevMode(enabled) {
    if (enabled) {
        // Enable all holiday themes regardless of season
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            Array.from(themeSelect.options).forEach(option => {
                option.disabled = false;
                option.text = option.text.replace(' (Coming Soon!)', '');
            });
        }
        
        // Add dev mode indicator
        const devIndicator = document.createElement('div');
        devIndicator.id = 'devModeIndicator';
        devIndicator.innerHTML = '🛠️ Dev Mode';
        devIndicator.style.cssText = `
            position: fixed;
            bottom: 16px;
            right: 16px;
            background: var(--accent);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: var(--card-shadow);
        `;
        document.body.appendChild(devIndicator);
    } else {
        // Disable out-of-season themes
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            Array.from(themeSelect.options).forEach(option => {
                const themeName = option.value;
                if (HOLIDAY_THEMES[themeName] && !isThemeInSeason(themeName)) {
                    option.disabled = true;
                    if (!option.text.includes('(Coming Soon!)')) {
                        option.text += ' (Coming Soon!)';
                    }
                }
            });
        }
        
        // Remove dev mode indicator
        const devIndicator = document.getElementById('devModeIndicator');
        if (devIndicator) {
            devIndicator.remove();
        }
    }
}

// Update the history card template to include a Wikipedia link
const HISTORY_CARD_TEMPLATE = `
    <!-- History Overview Card -->
    <div class="card history-card" style="display: none;">
        <div class="history-header" onclick="toggleHistoryOverview(event)">
            <h3 class="history-title">
                <i class="fas fa-book-open"></i>
                Location Overview
            </h3>
            <i class="fas fa-chevron-down expand-icon"></i>
        </div>
        <div class="history-content" id="historyContent">
            <div class="history-loading">
                <div class="spinner"></div>
                <p>Loading overview...</p>
            </div>
            <div class="history-text"></div>
            <a href="#" class="wiki-link" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-wikipedia-w"></i>
                Read more on Wikipedia
            </a>
        </div>
    </div>
`;

// Update the fetchLocationOverview function to return both content and URL
async function fetchLocationOverview(location) {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(location)}&format=json&origin=*`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.query.search.length) {
            return { content: null, url: null };
        }

        const pageId = searchData.query.search[0].pageid;
        const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts|info&exintro=1&inprop=url&format=json&origin=*`;
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const page = contentData.query.pages[pageId];
        return {
            content: page.extract || null,
            url: page.fullurl || null
        };
    } catch (error) {
        console.error('Overview fetch error:', error);
        return { content: null, url: null };
    }
}

// Update the updateWeatherUI function's history section
const existingUpdateWeatherUI = window.updateWeatherUI;
window.updateWeatherUI = async function(data) {
    await existingUpdateWeatherUI(data);
    
    // Add or update the history card
    let historyCard = document.querySelector('.history-card');
    if (!historyCard) {
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.insertAdjacentHTML('beforeend', HISTORY_CARD_TEMPLATE);
        historyCard = document.querySelector('.history-card');
    }

    const historyContent = document.querySelector('.history-text');
    const historyLoading = document.querySelector('.history-loading');
    const wikiLink = document.querySelector('.wiki-link');
    
    if (historyContent && historyLoading) {
        historyLoading.style.display = 'flex';
        historyContent.innerHTML = '';
        
        const { content, url } = await fetchLocationOverview(data.location.name);
        
        if (content && url) {
            historyCard.style.display = 'block';
            historyContent.innerHTML = content;
            wikiLink.href = url;
            wikiLink.style.display = 'flex';
        } else {
            historyCard.style.display = 'none';
        }
        
        historyLoading.style.display = 'none';
    }
};

// Add this function to handle the dropdown functionality
function toggleHistoryOverview(event) {
    // Prevent the click from propagating to the wiki link
    if (event) {
        event.stopPropagation();
    }
    
    const historyContent = document.getElementById('historyContent');
    const expandIcon = document.querySelector('.history-card .expand-icon');
    
    if (historyContent.classList.contains('expanded')) {
        historyContent.classList.remove('expanded');
        expandIcon.classList.remove('rotated');
    } else {
        historyContent.classList.add('expanded');
        expandIcon.classList.add('rotated');
    }
}
