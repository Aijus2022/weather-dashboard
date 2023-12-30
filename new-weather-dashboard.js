const apiKey = "ebb88b956bf8c05653e9de0ca2230d40";
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeatherContainer = document.getElementById("currentWeatherContainer"); // Update ID
const forecastContainer = document.getElementById("forecastContainer"); // Update ID
const historyList = document.getElementById("history-list");


// Event Listener for Search Button
searchButton.addEventListener("click", function() {
  const cityName = cityInput.value.trim();
  if (cityName !== "") {
    const apiUrl = `${baseUrl}?q=${cityName}&appid=${apiKey}`;
    getWeatherData(apiUrl, cityName);
  } else {
    alert("Please enter a city name.");
  }
});

// Load historical data when the page is initially loaded
document.addEventListener("DOMContentLoaded", function() {
  initializeLocalStorage();
  loadFromLocalStorage();
});

// Function to Initialize Local Storage if empty
function initializeLocalStorage() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.length) {
    localStorage.setItem('weatherHistory', JSON.stringify([]));
  }
}

// Function to Get Weather Data
function getWeatherData(apiUrl, cityName) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      displayForecast(data);
      addToHistory(cityName);
      saveToLocalStorage(cityName);
    })
    .catch(error => console.error("Error fetching weather data:", error));
}


// Function to Display Current Weather
function displayCurrentWeather(data) {
  const currentWeather = data.list[0];
  const temperatureKelvin = currentWeather.main.temp;
  const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
  const description = currentWeather.weather[0].description;
  const cityName = data.city.name;

  const currentWeatherHTML = `
    <h2>${cityName}</h2>
    <p>Temperature: ${temperatureCelsius} &deg;C</p>
    <p>Description: ${description}</p>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHTML;
}


// Function to Display Forecast
function displayForecast(data) {
  const forecastList = data.list.slice(1, 6);

  const forecastHTML = forecastList.map(entry => {
    const date = new Date(entry.dt_txt);
    const temperatureKelvin = entry.main.temp;
    const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
    const description = entry.weather[0].description;

    return `
      <div>
        <p>Date: ${date.toDateString()}</p>
        <p>Temperature: ${temperatureCelsius} &deg;C</p>
        <p>Description: ${description}</p>
      </div>
    `;
  }).join('');

  forecastContainer.innerHTML = forecastHTML;
}

// Function to Add to History
function addToHistory(cityName) {
  const listItem = document.createElement('li');
  listItem.textContent = cityName;
  historyList.appendChild(listItem);
}

// Function to Save to Local Storage
function saveToLocalStorage(cityName) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history.push(cityName);
  localStorage.setItem('weatherHistory', JSON.stringify(history));
}

// Function to Load from Local Storage
function loadFromLocalStorage() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history.forEach(city => addToHistory(city));
}
