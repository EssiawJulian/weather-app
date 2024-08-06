import {
  editCurrentWeatherInfoCards,
  editCurrentWeatherTempHighLow,
  editLocation,
  loadHourlyForecast,
  loadDailyForecast,
} from "./domEvents";

async function response(location) {
  try {
    const API_KEY = "HMYXKY73XNCYT7RFC5R73JWTR";
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.log("1");
      return "City entered is not found";
    }
    console.log("2");
    const data = await res.json();

    localStorage.setItem("location", location);

    updateCurrentWeather(data);
    loadHourlyDate(data);
    loadDailyDate(data);
    console.log(data);
  } catch (error) {
    console.error("Something went wrong:", error.message);
    return "Something went wrong";
  }
}

const addSearchListener = () => {
  const searchInput = document.querySelector(".search-bar");
  const suggestionsList = document.querySelector(".suggestions-list");
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      response(searchInput.value.trim()).then((result) => {
        checkResponseResultAndAlert(result);
      });

      searchInput.value = "";
      suggestionsList.innerHTML = "";
    }
  });
};

const checkResponseResultAndAlert = (result) => {
  if (result === "City entered is not found") {
    alert("Location not found");
  } else if (result === "Something went wrong") {
    alert("Something went wrong");
  }
};

const updateCurrentWeather = (data) => {
  const currentWeather = data.currentConditions;
  // Update Current Weather
  determineToggledButton();

  editCurrentWeatherTempHighLow(
    Math.floor(currentWeather.temp),
    data.days[0].tempmax,
    data.days[0].tempmin,
    currentWeather.conditions
  );

  editCurrentWeatherInfoCards(
    convertEpochToTime(currentWeather.sunriseEpoch),
    currentWeather.uvindex,
    convertEpochToTime(currentWeather.sunsetEpoch),
    currentWeather.windspeed,
    Math.floor(currentWeather.feelslike),
    currentWeather.precipprob,
    currentWeather.visibility,
    currentWeather.humidity
  );

  editLocation(
    data.resolvedAddress,
    convertEpochToDate(currentWeather.datetimeEpoch)
  );

  // Test -----------------------------------------
  console.log(epochToHours(data.currentConditions.datetimeEpoch));
};

const loadHourlyDate = (data) => {
  const hourlyContainer = document.querySelector(".hourly-container");
  hourlyContainer.innerHTML = "";
  const hourlyForecast = data.days[0].hours;
  // Load Hourly Forecast
  hourlyForecast.forEach((hour) => {
    loadHourlyForecast(
      epochToHours(hour.datetimeEpoch),
      hour.icon,
      Math.floor(hour.temp),
      data.days[0].description
    );
  });
};

const determineToggledButton = () => {
  const celsiusButton = document.querySelector("#celsius");

  if (celsiusButton.classList.contains("active")) {
    return "celsius";
  } else {
    return "fahrenheit";
  }
};

const loadDailyDate = (data) => {
  const dailyContainer = document.querySelector(".daily-forecast");
  dailyContainer.innerHTML = "";
  const dailyForecast = data.days;
  // Load Daily Forecast
  dailyForecast.forEach((day) => {
    loadDailyForecast(
      epochToWeekDay(day.datetimeEpoch),
      day.icon,
      Math.floor(day.tempmax),
      Math.floor(day.tempmin)
    );
  });
};

const convertEpochToDate = (epoch) => {
  const date = new Date(epoch * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const convertEpochToTime = (epoch) => {
  const date = new Date(epoch * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const epochToHours = (epoch) => {
  const date = new Date(epoch * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
  });
};

const epochToWeekDay = (epoch) => {
  const date = new Date(epoch * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
};

const convertToCelsius = (temp) => {
  return ((temp - 32) * 5) / 9;
};

export { addSearchListener, response, checkResponseResultAndAlert };
