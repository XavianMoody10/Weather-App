"use strict";

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// REUSABLE FUNCTIONS

// THIS FUNCTION REFRESHES THESUGGESTION BOX
const refreshSuggestion = (data) => {
  const suggestionBox = document.querySelector("#suggestion-box");

  // Remove old options in the suggestion box
  [...suggestionBox.children].forEach((child) => {
    suggestionBox.removeChild(child);
  });

  // Appends new options into suggestion box
  data.forEach((options) => {
    const paragraph = document.createElement("p");
    paragraph.classList.add("options");
    paragraph.textContent = `${options.name}, ${options.state}`;
    suggestionBox.append(paragraph);
  });
};

// IF A ERROR ACCURES DURING A FETCH API CALL, THIS FUNCTION WILL EXECUTE
const failedError = () => {
  const city = document.querySelector("#city");
  const country = document.querySelector("#country");
  const suggestionBox = document.querySelector("#suggestion-box");
  const searchBar = document.querySelector("#search input");

  if (searchBar.value.length >= 0) {
    city.textContent = "No Results";
    country.textContent = "";
  }

  [...suggestionBox.children].forEach((child) => {
    suggestionBox.removeChild(child);
  });
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// WHEN THE PAGE LOADS, THE USER'S CURRENT LOCATION'S WEATHER WILL DISPLAY
function getUserCoords() {
  const success = () => {
    const suggestionBox = document.querySelector("#suggestion-box");

    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      getWeather(latitude, longitude);
      console.log("LOADING...");

      setTimeout(() => {
        // ADD THE STYLE CLASS TO THE FIRST ELEMENT IN THE SUGGESTION BOX
        suggestionBox.children[0].classList.add("option-select");
      }, 300);
    });
  };

  const fail = () => {
    console.log("Failed");
  };
  navigator.geolocation.getCurrentPosition(success, fail);
}

// THIS WILL FETCH THE WEATHER DATA. MUST PASS IN A LONGITUDE AND LATITUDE OF LOCATION.
const getWeather = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=97773d5af5401e1b00aed3a63620b57e`
  )
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      displayWeather(data);
      locationSearch(data.name);
    })
    .catch(() => {
      console.log("Failed");
      failedError();
    });
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// This will fetch data of location the user is searching. THIS WILL DSIPLAY THE CITY, STATE, AND COUNTRY
const locationSearch = (location) => {
  const suggestionBox = document.querySelector("#suggestion-box");
  const searchBar = document.querySelector("#search input");

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=97773d5af5401e1b00aed3a63620b57e`
  )
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      getLocation(data);
      // suggestionBox.children[0].classList.add("option-select");
    })
    .catch(() => {
      console.log("Failed");
      failedError();
    });
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET LOCATION DATA
const getLocation = (data) => {
  const searchBar = document.querySelector("#search input");

  // If searchbar contains a value.
  if (
    (searchBar.value.length == 0 && data.length > 0) ||
    (searchBar.value.length > 0 && data.length > 0)
  ) {
    displayLocation(data[0], data);
  } else {
    displayLocation("", data);
  }
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION WILL DISPLAY THE LOCATION DATA ONTO THE DOM.
const displayLocation = (firstLoc, allLoc) => {
  if (!firstLoc == "") {
    locationDOM(firstLoc);
    displaySuggestions(allLoc);
  } else {
    displaySuggestions(allLoc);
  }
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION WILL DISPLAY THE LOCATION INFO INTO THE DOM
const locationDOM = (data) => {
  const cityDOM = document.querySelector("#location #city");
  const countryDOM = document.querySelector("#location #country");

  const locationDOMData = {
    cityName: data.name,
    stateName: data.state,
    countryName: data.country,
    dataDOM: function () {
      cityDOM.textContent = `${this.cityName}, ${this.stateName}`;
      countryDOM.textContent = `${this.countryName}`;
    },
  };

  locationDOMData.dataDOM();
};

//// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION DISPLAYS THE OPTIONS IN THE SUGGESTION BOX
const displaySuggestions = (data) => {
  const suggestionBox = document.querySelector("#suggestion-box");

  refreshSuggestion(data);

  // When the user clicks on any of the options
  document.querySelectorAll("*").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();

      if (e.target.classList.contains("options")) {
        const index = [...suggestionBox.children].indexOf(e.target);
        const lat = data[index].lat;
        const lon = data[index].lon;

        displayLocation(data[index], data);

        suggestionBox.children[index].classList.toggle("option-select");

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=97773d5af5401e1b00aed3a63620b57e`
        )
          .then((data) => data.json())
          .then((data) => {
            console.log(data);
            displayWeather(data);
          })
          .catch(() => {
            console.log("Failed");
            failedError();
          });
      }
    });
  });
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION WILL DISPLAY THE WEATHER DATA ONTO THE DOM.
const displayWeather = (data) => {
  const degrees = document.querySelector("#degrees span");
  const humidity = document.querySelector("#humidity span");
  const wind = document.querySelector("#wind span");
  const weatherImage = document.querySelector("#visual img");
  const weatherDescription = document.querySelector("#visual p");

  const weatherData = {
    degrees: data.main.temp,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    weatherImage: data.weather[0].icon,

    weatherDescription: function () {
      const wd = data.weather[0].description.split(" ");

      const stringMap = wd.map((word) => {
        const cap = word[0].toUpperCase();
        const rest = word.substring(1, word.length);
        const combine = cap.concat(rest);
        return combine;
      });

      weatherDescription.textContent = stringMap.join(" ");
    },

    weatherDOM: function () {
      degrees.textContent = `${this.degrees} \u00B0F`;
      humidity.textContent = `${this.humidity}%`;
      wind.textContent = `${this.wind} mph`;
      weatherImage.src = `https://openweathermap.org/img/wn/${this.weatherImage}@2x.png`;
    },
  };

  weatherData.weatherDescription();
  weatherData.weatherDOM();
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// THIS FUNCTION DISPLAYS THE DATE AND TIME OF EACH SEARCH
const searchTimestamp = () => {
  const monthDOM = document.querySelector("#month");
  const dayDOM = document.querySelector("#day");
  const yearDOM = document.querySelector("#year");
  const date = new Date();

  const allmonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateData = {
    month: date.getMonth(),
    day: date.getDate(),
    year: date.getFullYear(),

    dateDOM: function () {
      monthDOM.textContent = allmonths[this.month].toUpperCase();
      dayDOM.textContent = this.day;
      yearDOM.textContent = this.year;
    },
  };

  dateData.dateDOM();
};
searchTimestamp();
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION CONTAINS ALL EVENT HANDLERS WITHIN THE PROGRAM
const events = () => {
  const searchBar = document.querySelector("#search input");

  searchBar.addEventListener("input", (e) => {
    locationSearch(e.target.value);
  });

  window.addEventListener("load", getUserCoords);
};

events();
