$(function () {
  //VARIABLES
  //===========================================================================
  const numberOfDaysToForecast = 5;
  var searchHistoryArray = [];
  const apiKey = "593c0385215d05c9409439d0b1361f3e";
  const inputField = $("#city-input");
  var cityName;
  var todaysDate = moment().format("D MMMM YYYY");
  var inputSwitch;
  var listCity;
  if (localStorage.getItem("Weather search history")) {
    var arrayFromStorage = localStorage
      .getItem("Weather search history")
      .split(",");
  } else {
    var arrayFromStorage;
  }
  $("#search-btn").on("click", function () {
    event.preventDefault();

    if (inputField.val() === "") {
      return;
    } else {
      inputSwitch = true;
      showWeather();
    }
  });

  $("#clear-btn").on("click", function () {
    console.log("clear");
    localStorage.removeItem("Weather search history");
    location.reload();
  });

  $(document).on("click", ".list-group-item", function () {
    inputSwitch = false;
    listCity = $(this).text();
    showWeather();
  });

  function onLoad() {
    $("#search-history-items").empty();

    if (arrayFromStorage) {
      searchHistoryArray = arrayFromStorage;
    }

    for (let i = 0; i < searchHistoryArray.length; i++) {
      var aSearchTerm = $("<li>").text(searchHistoryArray[i]);
      aSearchTerm.addClass("list-group-item");
      $("#search-history-items").prepend(aSearchTerm);
    }
  }
  onLoad();

  function showWeather() {
    event.preventDefault();

    if (inputSwitch) {
      cityName = inputField.val();
    } else {
      cityName = listCity;
    }

    $("#header-row").empty();
    $("#current-weather-data").empty();
    $("#forecast-row").empty();

    var currentWeatherQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&appid=" +
      apiKey;

    $.ajax({
      url: currentWeatherQueryURL,
      method: "GET",
    }).then(function (response) {
      cityName = response.name;
      if (response) {
        if (searchHistoryArray.includes(cityName) === false) {
          populateSearchBar();
        }
      } else {
        alert("not a valid city name");
      }


      cityNameAndDate = $("<h4>").text(response.name + " (" + todaysDate + ")");
      currentIconEl = $("<img id='current-weather-icon'>").attr(
        "src",
        "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
      );
      $("#header-row").append(cityNameAndDate, currentIconEl);


      currentTempEl = $("<p>").text(
        "Temperature: " + Math.round(response.main.temp) + " °F"
      );
      currentHumidityEl = $("<p>").text(
        "Humidity: " + response.main.humidity + "%"
      );
      currentWindEl = $("<p>").text(
        "Wind speed: " + Math.round(response.wind.speed) + " MPH"
      );
      $("#current-weather-data").append(
        currentTempEl,
        currentHumidityEl,
        currentWindEl
      );


      var latitude = response.coord.lat;
      var longitude = response.coord.lon;

      //current UV index API Call
      var currentUVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: currentUVQueryURL,
        method: "GET",
      }).then(function (response) {
        

        currentUVLabel = $("<span>").text("UV Index: ");
        currentUVBadge = $("<span>").text(response.value);
        console.log(response.value);
        //apply UV colors
        if (response.value < 3) {
          // green
          currentUVBadge.addClass("uv uv-low");
        } else if (response.value >= 3 && response.value < 6) {
          //yellow
          currentUVBadge.addClass("uv uv-med");
        } else if (response.value >= 6 && response.value < 8) {
          //orange
          currentUVBadge.addClass("uv uv-high");
        } else if (response.value >= 8 && response.value <= 10) {
          //red
          currentUVBadge.addClass("uv uv-very-high");
        } else {
          //purple
          currentUVBadge.addClass("uv uv-extreme");
        }

        $("#current-weather-data").append(currentUVLabel, currentUVBadge);
      });

      //Forecast call
      var forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&exclude=current,minutely,hourly&appid=" +
        apiKey;

      $.ajax({
        url: forecastQueryURL,
        method: "GET",
      }).then(function (response) {
        $("#forecast-title").text("5-day Forecast");
        for (let i = 1; i < numberOfDaysToForecast + 1; i++) {
          //create a card
          var forecastCard = $("<div class='card forecast card-body'>");

          var forecastDayEl = $("<h5>");
          var unixSeconds = response.daily[i].dt;
          var unixMilliseconds = unixSeconds * 1000;
          var forecastDateUnix = new Date(unixMilliseconds);
          var forecastDoW = forecastDateUnix.toLocaleString("en-US", {
            weekday: "long",
          });
          forecastDayEl.text(forecastDoW);

          var hrLine = $("<hr />");

          var iconPara = $("<p>");
          var iconImg = $("<img>");
          iconImg.attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              response.daily[i].weather[0].icon +
              ".png"
          );
          iconPara.append(iconImg);

          var tempPara = $("<p>").text(
            "Temp: " + Math.round(response.daily[i].temp.day) + " °F"
          );

          var humidPara = $("<p>").text(
            "Humidity: " + response.daily[i].humidity + "%"
          );

          forecastCard.append(
            forecastDayEl,
            hrLine,
            iconPara,
            tempPara,
            humidPara
          );
          $("#forecast-row").append(forecastCard);
        }
      });
    });
  }
  function populateSearchBar() {
    $("#search-history-items").empty();

    searchHistoryArray.push(cityName);
    console.log("searchHistoryArray: " + searchHistoryArray);
    localStorage.setItem("Weather search history", searchHistoryArray);

    for (let i = 0; i < searchHistoryArray.length; i++) {
      var aSearchTerm = $("<li>").text(searchHistoryArray[i]);
      aSearchTerm.addClass("list-group-item");
      $("#search-history-items").prepend(aSearchTerm);
    }
  }
});