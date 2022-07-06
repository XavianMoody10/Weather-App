"use strict";
const searchBar = document.querySelector("#search input");

// WHEN THE PAGE LOADS, THE USER'S CURRENT LOCATION'S WEATHER WILL DISPLAY
function getUserCoords() {
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  });
}

// THIS WILL FETCH THE WEATHER DATA. MUST PASS IN A LONGITUDE AND LATITUDE OF LOCATION.
const getWeather = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=97773d5af5401e1b00aed3a63620b57e`
  )
    .then((data) => data.json())
    .then((data) => {
      displayWeather(data);
      locationSearch(data.name);
    })
    .catch((failed) => {
      console.log("Failed");
    });
};

// This will fetch data of location the user is searching. THIS WILL DSIPLAY THE CITY, STATE, AND COUNTRY
const locationSearch = (location) => {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=97773d5af5401e1b00aed3a63620b57e`
  )
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      getLocation(data);
    })
    .catch(() => {
      console.log("Failed");
    });
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET LOCATION DATA
const getLocation = (data) => {
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
  };

  cityDOM.textContent = `${locationDOMData.cityName}, ${locationDOMData.stateName}`;
  countryDOM.textContent = `${locationDOMData.countryName}`;
};

//// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION DISPLAYS THE OPTIONS IN THE SUGGESTION BOX
const displaySuggestions = (data) => {
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

  // When the user clicks on any of the options
  document.querySelectorAll("*").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();

      if (e.target.classList.contains("options")) {
        const index = [...suggestionBox.children].indexOf(e.target);
        displayLocation(data[index], data);

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${data[index].lat}&lon=${data[index].lon}&appid=97773d5af5401e1b00aed3a63620b57e`
        )
          .then((data) => data.json())
          .then((data) => {
            displayWeather(data);
          })
          .catch((failed) => {
            console.log("Failed");
          });
      }
    });
  });
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// THIS FUNCTION WILL DISPLAY THE WEATHER DATA ONTO THE DOM.
const displayWeather = (data) => {
  console.log(data);
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

searchBar.addEventListener("input", (e) => {
  locationSearch(e.target.value);
});

// WHEN A USER CLICKS ON ONE OF THE OPTIONS IN THE SUGGESTION BOX
// document.querySelectorAll("*").forEach((el) => {
//   const suggestionBox = document.querySelector("#suggestion-box");

//   el.addEventListener("click", (e) => {
//     e.stopPropagation();

//     if (e.target.classList.contains("options")) {
//       console.log(e.target.textContent);
//       const index = [...suggestionBox.children].indexOf(e.target);
//       console.log(index);
//     }
//   });
// });

window.addEventListener("load", getUserCoords);
