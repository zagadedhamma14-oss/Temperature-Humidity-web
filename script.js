// ⚠️ ACTION REQUIRED: Paste your active API key into the string below
const apiKey = '8b1ba5002969ff8cee83d2d31b6012d7'; 
const city = 'Pune';

// Dynamic Clock Engine
function runLiveClock() {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    document.getElementById('live-time').innerText = `Live • ${new Date().toLocaleTimeString('en-US', options)}`;
}
setInterval(runLiveClock, 1000);
runLiveClock();

// Interactive Button Mechanism Action States
function toggleRefreshState() {
    const btn = document.querySelector('.refresh-btn');
    const btnText = document.querySelector('.btn-text');
    
    btn.classList.add('refreshing');
    btnText.innerText = "Syncing Engine...";
    
    // Execute Data Pipeline
    fetchCompleteDashboardData();
}

// Integrated Weather and 12-Hour Prediction Pipeline
async function fetchCompleteDashboardData() {
    // Endpoints for Current State + 5 Day/3 Hour Forecast
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    try {
        // 1. Process Current Weather Metrics
        const currentRes = await fetch(currentWeatherUrl);
        if (!currentRes.ok) throw new Error('Current weather stream failed');
        const currentData = await currentRes.json();
        
        updateCurrentWeatherUI(currentData);

        // 2. Process 12-Hour Forecast Blocks
        const forecastRes = await fetch(forecastUrl);
        if (!forecastRes.ok) throw new Error('Forecast prediction pipeline failed');
        const forecastData = await forecastRes.json();
        
        updateHourlyForecastUI(forecastData);

    } catch (error) {
        console.error("Pipeline failure logic initiated:", error);
        document.getElementById('description').innerText = "Sync Failed. Check API configuration.";
    } finally {
        // Remove button animation class after processing completes
        setTimeout(() => {
            const btn = document.querySelector('.refresh-btn');
            const btnText = document.querySelector('.btn-text');
            if (btn) {
                btn.classList.remove('refreshing');
                btnText.innerText = "Refresh Dashboard";
            }
        }, 600);
    }
}

// UI Rendering Engine: Current Metrics & Ambient Animations
function updateCurrentWeatherUI(data) {
    document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
    
    // Manage Premium Floating Weather Icon Rendering
    const iconCode = data.weather[0].icon;
    const displayBox = document.querySelector('.weather-display');
    const existingImg = document.querySelector('.weather-icon-img');
    if (existingImg) existingImg.remove();
    
    const newImg = document.createElement('img');
    newImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    newImg.classList.add('weather-icon-img');
    displayBox.insertBefore(newImg, document.getElementById('temperature'));
    
    // Update ambient backdrop class engine based on weather condition profile
    const condition = data.weather[0].main.toLowerCase();
    document.body.className = ''; 
    if (condition.includes('clear')) document.body.classList.add('clear');
    else if (condition.includes('cloud')) document.body.classList.add('clouds');
    else if (condition.includes('rain') || condition.includes('drizzle')) document.body.classList.add('rain');
    else if (condition.includes('thunder')) document.body.classList.add('thunderstorm');
}

// UI Rendering Engine: 12-Hour Predictive Carousel
function updateHourlyForecastUI(data) {
    const container = document.getElementById('hourly-forecast');
    container.innerHTML = ''; // Wipe loading templates
    
    // The API updates forecast data every 3 hours. 
    // Capturing indexes 0 to 3 extracts exactly the next 12 hours cleanly.
    for (let i = 0; i < 4; i++) {
        const hourlyData = data.list[i];
        
        // Extract localized clock timestamp object
        const rawTime = new Date(hourlyData.dt * 1000);
        let hours = rawTime.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Normalize '0' to '12'
        const formattedTime = `${hours} ${ampm}`;
        
        const temp = Math.round(hourlyData.main.temp);
        const icon = hourlyData.weather[0].icon;
        
        // Generate and append localized virtual nodes inside our layout container
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <span class="forecast-time">${formattedTime}</span>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
            <span class="forecast-temp">${temp}°C</span>
        `;
        container.appendChild(card);
    }
}

// Initialize application on launch parameters
fetchCompleteDashboardData();

// Continuous automatic data-pipe refresh rule (every 10 minutes)
setInterval(fetchCompleteDashboardData, 600000);
