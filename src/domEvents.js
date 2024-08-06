import countryList from "./countryList";
import { response, checkResponseResultAndAlert } from "./dataFetcher";

const editCurrentWeatherInfoCards = (
  dew,
  uvIndex,
  sunset,
  wind,
  feelsLike,
  precipitation,
  visibility,
  humidity
) => {
  const dewElement = document.querySelector("[data-dew]");
  const uvIndexElement = document.querySelector("[data-uv-index]");
  const sunsetElement = document.querySelector("[data-sunset]");
  const windElement = document.querySelector("[data-wind]");
  const feelsLikeElement = document.querySelector("[data-feels-like]");
  const precipitationElement = document.querySelector("[data-precipitation]");
  const visibilityElement = document.querySelector("[data-visibility]");
  const humidityElement = document.querySelector("[data-humidity]");

  dewElement.textContent = dew;
  uvIndexElement.textContent = uvIndex;
  sunsetElement.textContent = sunset;
  windElement.textContent = wind + " mph";
  feelsLikeElement.textContent = changeTempToCelsiusOrFahrenheit(feelsLike) + "°";
  precipitationElement.textContent = precipitation + " in";
  visibilityElement.textContent = visibility + " mi";
  humidityElement.textContent = humidity + "%";
};

const editCurrentWeatherTempHighLow = (temp, tempHigh, tempLow, condition) => {
  const tempElement = document.querySelector("[data-temp]");
  const tempHighLowElement = document.querySelector("[data-temp-high-low]");
  const conditionElement = document.querySelector("[data-condition]");

  tempElement.textContent = changeTempToCelsiusOrFahrenheit(temp) + "°";
  tempHighLowElement.textContent = `H: ${tempHigh}° | L: ${tempLow}°`;
  conditionElement.textContent = condition;
};

const editLocation = (location, date) => {
  const locationElement = document.querySelector(".location");
  const dateElement = document.querySelector(".date");
  locationElement.textContent = location;
  dateElement.textContent = date;
};

const autoFillLocation = (() => {
  const locations = countryList;

  const autoSuggestions = () => {
    const inputElement = document.querySelector(".search-bar");
    const suggestionsList = document.querySelector(".suggestions-list");

    inputElement.addEventListener("input", function () {
      const query = inputElement.value.toLowerCase();
      suggestionsList.innerHTML = "";

      if (query.length > 0) {
        const filteredLocations = locations.filter((location) =>
          location.toLowerCase().includes(query)
        );

        filteredLocations.forEach((location) => {
          const listItem = document.createElement("li");
          listItem.textContent = location;
          listItem.classList.add("suggestion-item");

          listItem.addEventListener("click", function () {
            inputElement.value = location;
            suggestionsList.innerHTML = "";
            response(location).then((result) => {
              checkResponseResultAndAlert(result);
            });
          });
          suggestionsList.appendChild(listItem);
        });
      }
    });
  };
  return { autoSuggestions };
})();

const loadHourlyForecast = (time, icon, temp, description) => {
  const hourlyContainer = document.querySelector(".hourly-container");
  const weatherDescription = document.querySelector("[data-description]");
    weatherDescription.textContent = description;

  const hourlyCard = document.createElement("div");
  hourlyCard.classList.add("forecast-card-hourly");

  const timeElement = document.createElement("h5");
  timeElement.textContent = time;
  const imageElement = document.createElement("img");
  imageElement.src = require(`./assets/img/forecast-img/${icon}.svg`);
  const tempElement = document.createElement("h5");
  tempElement.textContent = changeTempToCelsiusOrFahrenheit(temp) + "°";

  hourlyCard.appendChild(timeElement);
  hourlyCard.appendChild(imageElement);
  hourlyCard.appendChild(tempElement);

  hourlyContainer.appendChild(hourlyCard);
};

const loadDailyForecast = (day, icon, tempHigh, tempLow) => {
    const dailyForecastContainer = document.querySelector(".daily-forecast");
    const list = document.createElement("li");
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("daily-forecast-row-container");

    const dateWeek = document.createElement("div");
    dateWeek.textContent = day;
    const imageElement = document.createElement("img");
    imageElement.src = require(`./assets/img/forecast-img/${icon}.svg`);
    const lowTemp = document.createElement("div");
    lowTemp.textContent = "Lowest Temp: " + changeTempToCelsiusOrFahrenheit(tempLow) + "°";
    const highTemp = document.createElement("div");
    highTemp.textContent = "Highest Temp: " + changeTempToCelsiusOrFahrenheit(tempHigh) + "°";

    rowContainer.appendChild(dateWeek);
    rowContainer.appendChild(imageElement);
    rowContainer.appendChild(lowTemp);
    rowContainer.appendChild(highTemp);

    list.appendChild(rowContainer);
    dailyForecastContainer.appendChild(list);
}

const toggleCelsiusFahrenheitButton = () => {
    const celsiusButton = document.querySelector("#celsius");
    const fahrenheitButton = document.querySelector("#fahrenheit");
    
    celsiusButton.addEventListener("click", () => {
        celsiusButton.classList.add("active");
        fahrenheitButton.classList.remove("active");
        localStorage.setItem("temperature", "celsius");
        response(localStorage.getItem("location")).then((result) => {
            checkResponseResultAndAlert(result);
        });
    });
    
    fahrenheitButton.addEventListener("click", () => {
        fahrenheitButton.classList.add("active");
        celsiusButton.classList.remove("active");
        localStorage.setItem("temperature", "fahrenheit");
        response(localStorage.getItem("location")).then((result) => {
            checkResponseResultAndAlert(result);
        });
    });
}


const changeTempToCelsiusOrFahrenheit = (temp) => {
    const fahrenheitButton = document.querySelector("#fahrenheit");
    
    if (fahrenheitButton.classList.contains("active")) {
        return temp;
    }else {
        return Math.floor((temp - 32) * 5/9);
    }
}

export {
  editCurrentWeatherInfoCards,
  editCurrentWeatherTempHighLow,
  editLocation,
  autoFillLocation,
  loadHourlyForecast,
  loadDailyForecast,
    toggleCelsiusFahrenheitButton,
    changeTempToCelsiusOrFahrenheit
};
