const openWeatherMapApiKey = "ebb88b956bf8c05653e9de0ca2230d40";
const nyTimesApiKey = "uDC9FtINoMvYp08zQbOiSeHxUhancoEb";

// API URLs
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const articleBaseUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

// DOM elements
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const currentWeatherContainer = document.getElementById("currentWeatherContainer");
const forecastContainer = document.getElementById("forecastContainer");
const rightSidebar = document.getElementById("right-sidebar");
const historyList = document.getElementById("history-list");

// Event Listener for Search Button
searchButton.addEventListener("click", function () {
  const cityName = cityInput.value.trim();
  if (cityName !== "") {
    const weatherApiUrl = `${baseUrl}?q=${cityName}&appid=${openWeatherMapApiKey}`;
    const articlesApiUrl = `${articleBaseUrl}?api-key=${nyTimesApiKey}&q=${cityName}`;
    getWeatherData(weatherApiUrl, cityName);
    getArticlesData(articlesApiUrl);
  } else {
    alert("Please enter a city name.");
  }
});

// Function to Get Weather Data
function getWeatherData(apiUrl, cityName) {
  console.log("Fetching weather data from:", apiUrl);
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Weather data received:", data);
      displayCurrentWeather(data, cityName);
      displayForecast(data);
      addToHistory(cityName);
      saveToLocalStorage(cityName);
    })
    .catch(error => console.error("Error fetching weather data:", error));
}

// Function to Display Current Weather
function displayCurrentWeather(data, cityName) {
  const currentWeather = data.list[0];
  const temperatureKelvin = currentWeather.main.temp;
  const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
  const description = currentWeather.weather[0].description;

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

  const forecastHTML = forecastList.map((entry, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    const temperatureKelvin = entry.main.temp;
    const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
    const description = entry.weather[0].description;

    return `
      <div>
        <p>Date: ${date.toLocaleDateString()}</p>
        <p>Temperature: ${temperatureCelsius} &deg;C</p>
        <p>Description: ${description}</p>
      </div>
    `;
  }).join('');

  forecastContainer.innerHTML = forecastHTML;
}

// Function to Get Articles Data
function getArticlesData(apiUrl) {
  console.log("Fetching articles data from:", apiUrl);
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Articles data received:", data);
      displayArticles(data);
    })
    .catch(error => console.error("Error fetching articles data:", error));
}


// Function to Display Articles
function displayArticles(data) {
  const articlesList = data.response.docs.slice(0, 5);

  // Display header with the current city name
  const cityName = cityInput.value.trim();
  const articlesHeader = document.createElement('h3');
  articlesHeader.id = 'articles-header';
  articlesHeader.textContent = `Articles about ${cityName}`;
  rightSidebar.innerHTML = ''; // Clear the rightSidebar content
  rightSidebar.appendChild(articlesHeader);

  // Display articles
  const articlesHTML = articlesList.map(article => {
    const articleDate = new Date(article.pub_date);
    const articleSnippet = article.snippet;

    return `
      <div>
        <p>Date: ${articleDate.toLocaleDateString()}</p>
        <p>Snippet: ${articleSnippet}</p>
      </div>
    `;
  }).join('');

  rightSidebar.innerHTML += articlesHTML;
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

// Function to Initialize Local Storage if empty
function initializeLocalStorage() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.length) {
    localStorage.setItem('weatherHistory', JSON.stringify([]));
  }
}

// Function to Load from Local Storage
function loadFromLocalStorage() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history.forEach(city => addToHistory(city));
}

// Load historical data when the page is initially loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeLocalStorage();
  loadFromLocalStorage();
});
