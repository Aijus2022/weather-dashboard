const apiKey = "ebb88b956bf8c05653e9de0ca2230d40";
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeatherContainer = document.getElementById("currentWeatherContainer"); // Add this line
const forecastContainer = document.getElementById("forecastContainer"); // Add this line
const historyList = document.getElementById("history-list"); // Assuming you have an element with id="history-list"

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
  const currentWeather = data.list[0]; // Assuming the current weather data is in the first item of the list
  const temperature = currentWeather.main.temp;
  const description = currentWeather.weather[0].description;
  const cityName = data.city.name;

  const currentWeatherHTML = `
    <h2>${cityName}</h2>
    <p>Temperature: ${temperature} &deg;C</p>
    <p>Description: ${description}</p>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHTML;
}

// Function to Display Forecast
function displayForecast(data) {
  // Assuming the forecast data is in the list starting from the second item
  const forecastList = data.list.slice(1, 6); // Displaying forecast for the next 5 days

  const forecastHTML = forecastList.map(entry => {
    const date = new Date(entry.dt_txt);
    const temperature = entry.main.temp;
    const description = entry.weather[0].description;

    return `
      <div>
        <p>Date: ${date.toDateString()}</p>
        <p>Temperature: ${temperature} &deg;C</p>
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

