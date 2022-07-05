"use strict";
// WHEN THE PAGE LOADS, THE CURRENT LOCATION'S WEATHER WILL DISPLAY
function getUserCoords() {
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  });
}

// This will fetch data of location the user is searching
const locationSearch = (e) => {
  // console.log(e.target.value);
  // fetch(
  //   `http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=5&appid=97773d5af5401e1b00aed3a63620b57e`
  // )
  //   .then((data) => data.json())
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch(() => {
  //     console.log("Failed");
  //   });
};

// THIS WILL FETCH THE WEATHER DATA. MUST PASS IN A LONGITUDE AND LATITUDE OF LOCATION.
const getWeather = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=97773d5af5401e1b00aed3a63620b57e`
  )
    .then((data) => data.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((failed) => {
      console.log("Failed");
    });
};

// THIS FUNCTION WILL DISPLAY THE DATA ONTO THE DOM
const displayWeather = (data) => {
  console.log(data);
};

document
  .querySelector("#search input")
  .addEventListener("input", locationSearch);

window.addEventListener("load", getUserCoords);
