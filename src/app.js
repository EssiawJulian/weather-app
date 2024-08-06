import "./styles.css";
import { addSearchListener, response, checkResponseResultAndAlert } from "./dataFetcher";
import { autoFillLocation, toggleCelsiusFahrenheitButton, changeTempToCelsiusOrFahrenheit } from "./domEvents";

document.addEventListener("DOMContentLoaded", () => {
  addSearchListener();
  autoFillLocation.autoSuggestions();
    toggleCelsiusFahrenheitButton();
    retrieveTempFromLocalStorage();
    retrieveLocationFromLocalStorage();
    response(localStorage.getItem("location")).then((result) => {
        checkResponseResultAndAlert(result);
    });
});

const retrieveTempFromLocalStorage = () => {
    const temp = localStorage.getItem("temperature");
    
    if (temp === null) {
        localStorage.setItem("temperature", "fahrenheit");
    }

    if (temp === "fahrenheit") {
        document.querySelector("#fahrenheit").click();
    } else if (temp === "celsius") {
        document.querySelector("#celsius").click();
    }
};

const retrieveLocationFromLocalStorage = () => {
    const location = localStorage.getItem("location");
    if (location === null) {
        localStorage.setItem("location", "New York");
    }
    
}
